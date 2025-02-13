"use client";

import Navbar from "@/components/Navbar/Navbar";
import Comments from "@/components/Comment/Comment";



export default function CommentsPage() {
  return (
    <main>
      <Navbar/>
      <h1>🔥 Comments</h1>
      <Comments/>
    </main>
  );
}