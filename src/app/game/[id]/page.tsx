"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchGameDetails } from "@/utils/api";
import Navbar from "@/components/Navbar/Navbar";
import NavSidebar from "@/components/Navbar/NavSidebar";
import axios from "axios";
import { useParams } from "next/navigation"; // ใช้ useParams แทนการเข้าถึง params.id ตรงๆ

export default function GameDetailPage() {
  const [game, setGame] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const { data: session } = useSession();

  const { id } = useParams(); // ดึง params ด้วย useParams

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const gameResponse = await fetchGameDetails(id);
        const commentsResponse = await axios.get(`/api/comments/${id}`);
        setGame(gameResponse);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching game details or comments:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment) return;

    try {
      const response = await axios.post("/api/comments", {
        gameId: id,
        content: newComment,
      });

      if (response.status === 200) {
        setComments((prevComments) => [...prevComments, response.data]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (!game) {
    return <p>Game not found</p>;
  }

  return (
    <main className="game-detail">
      <Navbar />
      <NavSidebar />
      <div className="game-header">
        <h1>{game.name}</h1>
        <img src={game.background_image} alt={game.name} className="game-banner" />
      </div>

      <div className="game-info">
        <h2>📝 About</h2>
        <p>{game.description_raw}</p>

        <div className="info-grid">
          <div>
            <h3>🕹️ Genres</h3>
            <ul>
              {game.genres.map((genre: any) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3>🎮 Platforms</h3>
            <ul>
              {game.platforms.map((platform: any) => (
                <li key={platform.platform.id}>{platform.platform.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3>⭐ Ratings</h3>
            <p>Metacritic: {game.metacritic ?? "N/A"}</p>
          </div>

          <div>
            <h3>📅 Released</h3>
            <p>{game.released}</p>
          </div>
        </div>
      </div>

      <div className="game-comments">
        <h2>Comments</h2>

        <div className="comment-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>{comment.content}</p>
                <small>by {comment.user.name}</small>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        {session ? (
          <div className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
            />
            <button onClick={handleCommentSubmit}>Post Comment</button>
          </div>
        ) : (
          <p>You need to be logged in to post a comment.</p>
        )}
      </div>
    </main>
  );
}
