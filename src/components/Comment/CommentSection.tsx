"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Alert from "@/components/Alert";
import CommentItem, { CommentType } from "./CommentItem"; // ✅ Import CommentItem and CommentType

export { CommentType }; // Re-export CommentType for easier access

export default function CommentSection({ gameId }: { gameId: string }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?gameId=${gameId}`);
        const commentsData: CommentType[] = await response.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [gameId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment, gameId }),
      });

      if (response.ok) {
        const newComment: CommentType = await response.json();
        setComments((prevComments) => [newComment, ...prevComments]);
        setComment("");
        setShowAlert(true);
        setAlertMessage("Comment added successfully!");
        setAlertType("success");
      } else {
        const errorData = await response.json();
        setShowAlert(true);
        setAlertMessage(errorData.error || "Failed to add comment.");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setShowAlert(true);
      setAlertMessage("An error occurred while posting the comment.");
      setAlertType("error");
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();

    if (!replyContent.trim()) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: replyContent, gameId, parentId }),
      });

      if (response.ok) {
        const newReply: CommentType = await response.json();

        setComments(prevComments => {
          const updatedComments = prevComments.map(rootComment => {
            if (rootComment.id === parentId) {
              return {
                ...rootComment,
                replies: rootComment.replies ? [...rootComment.replies, newReply] : [newReply]
              };
            } else {
              return rootComment;
            }
          });
          return updatedComments;
        });


        setReplyContent("");
        setReplyingToCommentId(null);
        setShowAlert(true);
        setAlertMessage("Reply added successfully!");
        setAlertType("success");
      } else {
        const errorData = await response.json();
        setShowAlert(true);
        setAlertMessage(errorData.error || "Failed to add reply.");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      setShowAlert(true);
      setAlertMessage("An error occurred while posting the reply.");
      setAlertType("error");
    }
  };


  const handleDelete = async (commentId: string, parentId: string | null) => {
    try {
      const response = await fetch("/api/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        setComments(prevComments => {
          if (parentId) { // If deleting a reply (เหมือนเดิม)
            return prevComments.map(rootComment => ({
              ...rootComment,
              replies: rootComment.replies?.filter(reply => reply.id !== commentId) || []
            }));
          } else { // If deleting a root comment (ปรับปรุง)
            return prevComments.filter(c => c.id !== commentId); // ✅ Filter root comment ออก (replies จะถูกลบที่ backend แล้ว)
          }
        });
        setShowAlert(true);
        setAlertMessage("Comment deleted successfully!");
        setAlertType("success");
      } else {
        const errorData = await response.json();
        setShowAlert(true);
        setAlertMessage(errorData.error || "Error deleting comment");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setShowAlert(true);
      setAlertMessage("An error occurred while deleting the comment.");
      setAlertType("error");
    }
  };


  const handleEdit = (commentId: string) => {
    setEditingCommentId(commentId);
    const currentComment = comments.find((c) => c.id === commentId);
    if (currentComment) {
      setEditedComment(`Previous: ${currentComment.content}`);
    }
  };

  const handleUpdate = async (commentId: string, newContent: string) => {
    if (!newContent.trim()) return;

    try {
      const response = await fetch("/api/comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: commentId, content: newContent }),
      });

      if (response.ok) {
        const updatedComment: CommentType = await response.json();
        setComments(prevComments => {
          return prevComments.map(c => {
            if (c.id === commentId) {
              return updatedComment;
            } else {
              const updatedReplies = c.replies?.map(reply =>
                reply.id === commentId ? updatedComment : reply
              ) || [];
              return { ...c, replies: updatedReplies };
            }
          });
        });
        setEditingCommentId(null);
        setEditedComment("");
        setShowAlert(true);
        setAlertMessage("Comment updated successfully!");
        setAlertType("success");
      }
      else {
        const errorData = await response.json();
        setShowAlert(true);
        setAlertMessage(errorData.error || "Error updating comment");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      setShowAlert(true);
      setAlertMessage("An error occurred while updating the comment.");
      setAlertType("error");
    }
  };


  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedComment("");
  };


  return (
    <div>
      <h3 className="font-bold text-lg">💬 Comments</h3>
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}

      <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="border p-2 rounded"
          placeholder="Write a comment..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      <div className="mt-4">
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            session={session}
            editingCommentId={editingCommentId}
            setEditingCommentId={setEditingCommentId}
            editedComment={editedComment}
            setEditedComment={setEditedComment}
            handleUpdate={handleUpdate}
            handleCancelEdit={handleCancelEdit}
            handleDelete={(commentId, parentId) => handleDelete(commentId, parentId)}
            replyingToCommentId={replyingToCommentId}
            setReplyingToCommentId={setReplyingToCommentId}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            handleReplySubmit={handleReplySubmit}
            setComments={setComments}
          />
        ))}
      </div>
    </div>
  );
}