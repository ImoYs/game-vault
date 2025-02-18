"use client";

import Navbar from "@/components/Navbar/Navbar";
import Comments from "@/components/Comment/CommentSection";

export default function CommentsPage() {
  return (
    <main>
      <Navbar/>
      <h1>🔥 Comments</h1>
      <Comments/>
    </main>
  );
}