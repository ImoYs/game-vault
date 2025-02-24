// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { format } from 'date-fns';
// import { enUS } from 'date-fns/locale';

// export default function CommentSection({ gameId }: { gameId: string }) {
//   const { data: session } = useSession();
//   const [comment, setComment] = useState("");
//   const [comments, setComments] = useState<any[]>([]);
//   const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
//   const [editedComment, setEditedComment] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");


//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const response = await fetch(`/api/comments?gameId=${gameId}`);
//         const commentsData = await response.json();
//         setComments(commentsData);
//       } catch (error) {
//         console.error("Error fetching comments:", error);
//       }
//     };

//     fetchComments();
//   }, [gameId]);

//   const handleCommentSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!comment.trim()) return;

//     try {
//       const response = await fetch("/api/comments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ content: comment, gameId }),
//       });

//       if (response.ok) {
//         const newComment = await response.json();
//         newComment.user = { name: session?.user?.name || "Unknown User" };
//         newComment.userId = session?.user?.id;
//         setComments((prevComments) => [newComment, ...prevComments]);
//         setComment("");
//         setShowAlert(true);
//         setAlertMessage("Comment added successfully!");
//         setAlertType("success");
//         setTimeout(() => setShowAlert(false), 3000);
//       } else {
//         const errorData = await response.json();
//         setShowAlert(true);
//         setAlertMessage(errorData.error || "Failed to add comment.");
//         setAlertType("error");
//         setTimeout(() => setShowAlert(false), 3000);
//       }
//     } catch (error) {
//       console.error("Error posting comment:", error);
//       setShowAlert(true);
//       setAlertMessage("An error occurred while posting the comment.");
//       setAlertType("error");
//       setTimeout(() => setShowAlert(false), 3000);
//     }
//   };

//   const handleDelete = async (commentId: string) => {
//     try {
//       const response = await fetch("/api/comments", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ commentId }),
//       });

//       if (response.ok) {
//         setComments(comments.filter((c) => c.id !== commentId));
//         setShowAlert(true);
//         setAlertMessage("Comment deleted successfully!");
//         setAlertType("success");
//         setTimeout(() => setShowAlert(false), 3000);
//       } else {
//         const errorData = await response.json();
//         setShowAlert(true);
//         setAlertMessage(errorData.error || "Error deleting comment");
//         setAlertType("error");
//         setTimeout(() => setShowAlert(false), 3000);
//       }
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//       setShowAlert(true);
//       setAlertMessage("An error occurred while deleting the comment.");
//       setAlertType("error");
//       setTimeout(() => setShowAlert(false), 3000);
//     }
//   };

//     const handleEdit = (commentId: string) => {
//     setEditingCommentId(commentId);
//     const currentComment = comments.find((c) => c.id === commentId);
//     if (currentComment) {
//       setEditedComment(currentComment.content);
//     }
//   };

//   const handleUpdate = async (commentId: string, newContent: string) => {


//     if (!newContent.trim()) return;


//     try {
//       const response = await fetch("/api/comments", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ commentId: commentId, content: newContent }),
//       });

//       if (response.ok) {
//         const updatedComment = await response.json();
//         updatedComment.user = { name: session?.user?.name || "Unknown User" };
//         setComments(
//           comments.map((c) => (c.id === updatedComment.id ? updatedComment : c))
//         );
//         setEditingCommentId(null);
//         setEditedComment("");
//         setShowAlert(true);
//         setAlertMessage("Comment updated successfully!");
//         setAlertType("success");
//         setTimeout(() => setShowAlert(false), 3000);
//       }
//       else {
//         const errorData = await response.json();
//         setShowAlert(true);
//         setAlertMessage(errorData.error || "Error updating comment");
//         setAlertType("error");
//         setTimeout(() => setShowAlert(false), 3000);
//       }
//     } catch (error) {
//       console.error("Error updating comment:", error);
//       setShowAlert(true);
//       setAlertMessage("An error occurred while updating the comment.");
//       setAlertType("error");
//       setTimeout(() => setShowAlert(false), 3000);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingCommentId(null);
//     setEditedComment("");
//   };

//   return (
//     <div className="relative"> {/* เพิ่ม relative ที่ container */}
//       <h3 className="font-bold text-lg">💬 Comments</h3>

//       {/* Alert (ย้ายมาอยู่บนสุด) */}
//       {showAlert && (
//         <div
//           className={`absolute top-0 left-0 w-full z-50 border px-4 py-3 rounded  ${ // เปลี่ยน fixed เป็น absolute
//             alertType === "success"
//               ? "bg-green-100 border-green-400 text-green-700"
//               : "bg-red-100 border-red-400 text-red-700"
//           }`}
//           role="alert"
//         >
//           <strong className="font-bold">
//             {alertType === "success" ? "Success!" : "Error!"}
//           </strong>
//           <span className="block sm:inline"> {alertMessage}</span>
//         </div>
//       )}

//       {/* ฟอร์มคอมเมนต์ */}
//       <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="border p-2 rounded"
//           placeholder="Write a comment..."
//         />
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Submit
//         </button>
//       </form>

//       {/* แสดงคอมเมนต์ */}
//       <div className="mt-4">
//         {comments.map((c) => (
//           <div key={c.id} className="border-b py-2">
//             <p>
//               <strong>{c.user?.name || "Unknown User"}</strong>:
//             </p>
//             <p>
//               POSTED: {format(new Date(c.createdAt), 'dd MMM yyyy, hh:mm a', { locale: enUS })}
//             </p>

//             {c.updatedAt && new Date(c.createdAt).toISOString() !== new Date(c.updatedAt).toISOString() && (
//               <p>
//                 last edited:{" "}
//                 {format(new Date(c.updatedAt), 'dd MMM yyyy, hh:mm a', { locale: enUS })}
//               </p>
//             )}

//             {editingCommentId === c.id ? (
//               // แสดง textarea สำหรับแก้ไข
//               <div>
//                 <textarea
//                   value={editedComment}
//                   onChange={(e) => setEditedComment(e.target.value)}
//                   className="border p-2 rounded w-full"
//                 />
//                 <div className="flex gap-2 mt-2">
//                   <button
//                     onClick={() => handleUpdate(c.id, editedComment)} // ส่ง ID และ content ที่แก้ไข
//                     className="bg-green-500 text-white px-4 py-2 rounded"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelEdit}
//                     className="bg-gray-500 text-white px-4 py-2 rounded"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               // แสดงข้อความคอมเมนต์ปกติ
//               <p>{c.content}</p>
//             )}

//             {session?.user?.id === c.userId && editingCommentId !== c.id && (
//               <div className="flex gap-4 mt-2">
//                 <button
//                   onClick={() => handleEdit(c.id)}
//                   className="text-yellow-500"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(c.id)}
//                   className="text-red-500"
//                 >
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Alert from "@/components/Alert"; // Import Alert component

export default function CommentSection({ gameId }: { gameId: string }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");


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
        setShowAlert(true);
        setAlertMessage("Comment added successfully!");
        setAlertType("success");
        // setTimeout(() => setShowAlert(false), 3000);  // เอา setTimeout ออก
      } else {
        const errorData = await response.json();
        setShowAlert(true);
        setAlertMessage(errorData.error || "Failed to add comment.");
        setAlertType("error");
        // setTimeout(() => setShowAlert(false), 3000); // เอา setTimeout ออก
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setShowAlert(true);
      setAlertMessage("An error occurred while posting the comment.");
      setAlertType("error");
      // setTimeout(() => setShowAlert(false), 3000);  // เอา setTimeout ออก
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
        setShowAlert(true);
        setAlertMessage("Comment deleted successfully!");
        setAlertType("success");
        // setTimeout(() => setShowAlert(false), 3000); // เอา setTimeout ออก
      } else {
        const errorData = await response.json();
        setShowAlert(true);
        setAlertMessage(errorData.error || "Error deleting comment");
        setAlertType("error");
        // setTimeout(() => setShowAlert(false), 3000);  // เอา setTimeout ออก
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setShowAlert(true);
      setAlertMessage("An error occurred while deleting the comment.");
      setAlertType("error");
      // setTimeout(() => setShowAlert(false), 3000); // เอา setTimeout ออก
    }
  };

  const handleEdit = (commentId: string) => {
    setEditingCommentId(commentId);
    const currentComment = comments.find((c) => c.id === commentId);
    if (currentComment) {
      setEditedComment(currentComment.content);
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
        const updatedComment = await response.json();
        updatedComment.user = { name: session?.user?.name || "Unknown User" };
        setComments(
          comments.map((c) => (c.id === updatedComment.id ? updatedComment : c))
        );
        setEditingCommentId(null);
        setEditedComment("");
        setShowAlert(true);
        setAlertMessage("Comment updated successfully!");
        setAlertType("success");
        // setTimeout(() => setShowAlert(false), 3000); // เอา setTimeout ออก
      }
      else {
        const errorData = await response.json();
        setShowAlert(true);
        setAlertMessage(errorData.error || "Error updating comment");
        setAlertType("error");
        // setTimeout(() => setShowAlert(false), 3000); // เอา setTimeout ออก
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      setShowAlert(true);
      setAlertMessage("An error occurred while updating the comment.");
      setAlertType("error");
      // setTimeout(() => setShowAlert(false), 3000); // เอา setTimeout ออก
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedComment("");
  };

  return (
    <div>
      <h3 className="font-bold text-lg">💬 Comments</h3>
      {/* ใช้ Alert component */}
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}

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

      <div className="mt-4">
        {comments.map((c) => (
          // ... (ส่วนแสดง comment เหมือนเดิม)
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