"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // ใช้สำหรับดึงข้อมูลผู้ใช้ที่ล็อกอิน

export default function CommentSection({ gameId }: { gameId: string }) {
  const { data: session } = useSession(); // ตรวจสอบผู้ใช้ที่ล็อกอิน
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null); // คิดว่าเป็น comment ID ที่ต้องการแก้ไข

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
        // เพิ่มชื่อผู้ใช้จาก session ในคอมเมนต์
        newComment.user = { name: session?.user?.name || "Unknown User" };
        newComment.userId = session?.user?.id; // เก็บ userId
        setComments((prevComments) => [newComment, ...prevComments]); // เพิ่มคอมเมนต์ใหม่ที่ด้านบนสุด
        setComment(""); // ล้างฟอร์ม
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
        setComments(comments.filter((c) => c.id !== commentId)); // ลบคอมเมนต์จากหน้าจอ
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error deleting comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEdit = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setComment(currentContent); // ตั้งค่าให้ textarea มีค่าเป็นคอมเมนต์เดิม
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim() || !editingCommentId) return;

    try {
      const response = await fetch("/api/comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: editingCommentId, content: comment }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        // เพิ่มชื่อผู้ใช้จาก session ในคอมเมนต์
        updatedComment.user = { name: session?.user?.name || "Unknown User" };
        setComments(
          comments.map((c) =>
            c.id === updatedComment.id ? updatedComment : c
          )
        );
        setEditingCommentId(null); // รีเซ็ตการแก้ไข
        setComment(""); // ล้างฟอร์ม
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg">💬 Comments</h3>

      {/* ฟอร์มคอมเมนต์ */}
      <form
        onSubmit={editingCommentId ? handleUpdate : handleCommentSubmit}
        className="flex flex-col gap-2"
      >
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded"
          placeholder="Write a comment..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingCommentId ? "Update" : "Submit"}
        </button>
      </form>

      {/* แสดงคอมเมนต์ */}
      <div className="mt-4">
        {comments.map((c) => (
          <div key={c.id} className="border-b py-2">
            <p><strong>{c.user?.name || "Unknown User"}</strong>:</p>
            <p>{c.createdAt}</p>
            <p>{c.content}</p>

            {/* ปุ่มลบและแก้ไขเฉพาะผู้ที่เป็นเจ้าของคอมเมนต์ */}
            {session?.user?.id === c.user?.id && (
              <div className="flex gap-4 mt-2">
                <button onClick={() => handleEdit(c.id, c.content)} className="text-yellow-500">
                  Edit
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-red-500">
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
