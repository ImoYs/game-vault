"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from 'date-fns'; // Import ฟังก์ชัน format
import { enUS } from 'date-fns/locale'; // Import locale ของ date-fns

export default function CommentSection({ gameId }: { gameId: string }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState(""); // State สำหรับเก็บข้อความที่กำลังแก้ไข


  // ฟังก์ชันดึงข้อมูลคอมเมนต์จาก API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?gameId=${gameId}`);
        const commentsData = await response.json();
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
        const newComment = await response.json();
        newComment.user = { name: session?.user?.name || "Unknown User" };
        newComment.userId = session?.user?.id;
        setComments((prevComments) => [newComment, ...prevComments]);
        setComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch("/api/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error deleting comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEdit = (commentId: string) => {
    setEditingCommentId(commentId);
    //  ไม่ต้อง setComment แล้ว
    const currentComment = comments.find((c) => c.id === commentId);
    if (currentComment) {
      setEditedComment(currentComment.content); // เก็บ content ปัจจุบันไว้ใน state ใหม่
    }
  };

  const handleUpdate = async (commentId: string, newContent: string) => {
    // ไม่ต้องรับ event แล้ว

    if (!newContent.trim()) return; // ตรวจสอบว่ามีข้อความที่แก้ไขหรือไม่


    try {
      const response = await fetch("/api/comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: commentId, content: newContent }), // ใช้ newContent
      });

      if (response.ok) {
        const updatedComment = await response.json();
        updatedComment.user = { name: session?.user?.name || "Unknown User" };
        setComments(
          comments.map((c) =>
            c.id === updatedComment.id ? updatedComment : c
          )
        );
        setEditingCommentId(null); // Reset editing state
        setEditedComment("");     // Clear edited comment
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedComment("");
  };


  return (
    <div>
      <h3 className="font-bold text-lg">💬 Comments</h3>

      {/* ฟอร์มคอมเมนต์ */}
      <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded"
          placeholder="Write a comment..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {/* แสดงคอมเมนต์ */}
      <div className="mt-4">
        {comments.map((c) => (
          <div key={c.id} className="border-b py-2">
            <p>
              <strong>{c.user?.name || "Unknown User"}</strong>:
            </p>
            <p>
              POSTED: {format(new Date(c.createdAt), 'dd MMM yyyy, hh:mm a', { locale: enUS })}
            </p>

            {c.updatedAt && new Date(c.createdAt).toISOString() !== new Date(c.updatedAt).toISOString() && (
              <p>
                last edited:{" "}
                {format(new Date(c.updatedAt), 'dd MMM yyyy, hh:mm a', { locale: enUS })}
              </p>
            )}


            {editingCommentId === c.id ? (
              // แสดง textarea สำหรับแก้ไข
              <div>
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdate(c.id, editedComment)} // ส่ง ID และ content ที่แก้ไข
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // แสดงข้อความคอมเมนต์ปกติ
              <p>{c.content}</p>
            )}

            {session?.user?.id === c.userId && editingCommentId !== c.id && (
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleEdit(c.id)}
                  className="text-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}