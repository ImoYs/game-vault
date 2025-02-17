// // \src\app\game\[id]\page.tsx
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { fetchGameDetails, fetchGameScreenshots, fetchGameTrailers } from "@/utils/api";
// import Navbar from "@/components/Navbar/Navbar";
// import NavSidebar from "@/components/Navbar/NavSidebar";
// import { useParams } from "next/navigation";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// export default function GameDetailPage() {
//   const [game, setGame] = useState<any>(null);
//   const [screenshots, setScreenshots] = useState<any[]>([]);
//   const [trailers, setTrailers] = useState<any[]>([]); 
//   const { id } = useParams();

//   // สร้างฟังก์ชันที่ต้องการให้ทำงานเพียงครั้งเดียว
//   const fetchData = useCallback(async () => {
//     if (!id) return;
//     try {
//       const gameResponse = await fetchGameDetails(id);
//       setGame(gameResponse);

//       const screenshotsResponse = await fetchGameScreenshots(id);
//       setScreenshots(screenshotsResponse);

//       const trailersResponse = await fetchGameTrailers(id);
//       setTrailers(trailersResponse);
//     } catch (error) {
//       console.error("Error fetching game details:", error);
//     }
//   }, [id]); // ขึ้นอยู่กับ id เท่านั้น

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]); // เรียกใช้งาน fetchData เมื่อ id เปลี่ยนแปลง

//   if (!game) {
//     return <p className="text-center text-gray-500">Loading game details...</p>;
//   }

//   const pcPlatform = game?.platforms?.find((p: any) => p.platform.id === 4);
//   const requirements = pcPlatform?.requirements;

//   return (
//     <main className="game-detail bg-white text-black">
//       <Navbar />
//       <NavSidebar />
//       <br />

//       <div className="game-header">
//         <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
//       </div>

//       {/* Grid สำหรับจัดตำแหน่งข้อมูล */}
//       <div className="grid grid-cols-6 gap-4 mt-6">
//         {/* รูปภาพ */}
//         <div className="col-span-4 col-start-2">
//           <img src={game.background_image} alt={game.name} className="w-full h-auto rounded-lg" />
//         </div>

//         {/* Game Trailers */}
//         <div className="col-span-4 col-start-2 mt-6">
//           <h3 className="font-bold text-lg">🎬 Game Trailers</h3>
//           {trailers.length > 0 ? (
//             <div className="flex flex-wrap gap-4">
//               {trailers.map((trailer) => (
//                 <div key={trailer.id} className="w-full md:w-1/2 lg:w-1/3">
//                   <iframe
//                     width="100%"
//                     height="200"
//                     src={`https://www.youtube.com/embed/${trailer?.youtube_id}`} // ใช้ youtube_id แทน trailer.data?.max
//                     title={trailer.name}
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     className="rounded-lg shadow-md"
//                   ></iframe>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">No trailers available</p>
//           )}
//         </div>

//         {/* Screenshots */}
//         <div className="col-span-4 col-start-2">
//           {screenshots?.length > 0 ? (
//             <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="w-full h-96">
//               {screenshots.map((screenshot) => (
//                 <SwiperSlide key={screenshot.id}>
//                   <img
//                     src={screenshot.image}
//                     alt={`Screenshot ${screenshot.id}`}
//                     className="w-full h-full object-cover rounded-lg"
//                     onError={(e) => console.error("Image failed to load:", screenshot.image)}
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           ) : (
//             <p className="text-gray-500">No screenshots available</p>
//           )}
//         </div>

//         {/* About Game */}
//         <div className="col-start-2 col-end-4">
//           <h3 className="font-bold text-lg">📝 ABOUT THIS GAME</h3>
//           <p className="text-gray-600">{game.description_raw}</p>
//         </div>

//         {/* Ratings, Genres, Released */}
//         <div className="col-span-2 col-end-6">
//           <h3 className="font-bold text-lg">⭐ Ratings</h3>
//           <p>Metacritic: {game.metacritic ?? "N/A"}</p>
//           <h3 className="font-bold text-lg">🕹️ Genres</h3>
//           <ul className="text-gray-600">
//             {game.genres.map((genre: any) => (
//               <li key={genre.id}>{genre.name}</li>
//             ))}
//           </ul>
//           <h3 className="font-bold text-lg">📅 Released</h3>
//           <p>{game.released}</p>
//         </div>

//         {/* Tags */}
//         <div className="col-span-4 col-start-2 mt-6">
//           <h3 className="font-bold text-lg">🏷 Tags</h3>
//           <div className="flex flex-wrap gap-2">
//             {game.tags.map((tag: any) => (
//               <span key={tag.id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
//                 {tag.name}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Platforms */}
//         <div className="col-start-2 col-end-4 mt-6">
//           <h3 className="font-bold text-lg">🎮 Platforms</h3>
//           <ul className="text-gray-600">
//             {game.platforms.map((platform: any) => (
//               <li key={platform.platform.id}>{platform.platform.name}</li>
//             ))}
//           </ul>
//         </div>

//         {/* System Requirements */}
//         <div className="col-span-2 col-end-6 mt-6">
//           <h3 className="font-bold text-lg">💻 System Requirements (PC)</h3>
//           {requirements ? (
//             <details className="cursor-pointer">
//               <summary className="text-blue-600 underline">View System Requirements</summary>
//               {requirements.minimum && <p><strong>Minimum:</strong> {requirements.minimum}</p>}
//               {requirements.recommended && <p><strong>Recommended:</strong> {requirements.recommended}</p>}
//             </details>
//           ) : (
//             <p className="text-gray-500">No system requirements available</p>
//           )}
//         </div>

//         {/* Visit Reddit Community */}
//         <div className="col-span-4 col-start-2 mt-6">
//           <h3 className="font-bold text-lg">Reddit</h3>
//           {game?.reddit_url && (
//             <p className="text-blue-600 mt-2">
//               🔗 <a href={game.reddit_url} target="_blank" rel="noopener noreferrer" className="underline">
//                 Visit Reddit Community
//               </a>
//             </p>
//           )}
//         </div>
//       </div>

//     </main>
//   );
// }
"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchGameDetails, fetchGameScreenshots, fetchGameTrailers } from "@/utils/api";
import Navbar from "@/components/Navbar/Navbar";
import NavSidebar from "@/components/Navbar/NavSidebar";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function GameDetailPage() {
  const [game, setGame] = useState<any>(null);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [trailers, setTrailers] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]); // คอมเมนต์ที่ดึงมาจาก API
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const gameResponse = await fetchGameDetails(id);
      setGame(gameResponse);

      const screenshotsResponse = await fetchGameScreenshots(id);
      setScreenshots(screenshotsResponse);

      const trailersResponse = await fetchGameTrailers(id);
      setTrailers(trailersResponse);

      // ดึงคอมเมนต์ของเกม
      const commentResponse = await fetch(`/api/comments?gameId=${id}`);
      const commentsData = await commentResponse.json();
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching game details:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!game) {
    return <p className="text-center text-gray-500">Loading game details...</p>;
  }

  const pcPlatform = game?.platforms?.find((p: any) => p.platform.id === 4);
  const requirements = pcPlatform?.requirements;

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment, gameId: id }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        setComment(""); // ล้างฟอร์มหลังจากส่งคอมเมนต์
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <main className="game-detail bg-white text-black">
      <Navbar />
      <NavSidebar />
      <br />

      <div className="game-header">
        <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
      </div>

      <div className="grid grid-cols-6 gap-4 mt-6">
        {/* รูปภาพ */}
        <div className="col-span-4 col-start-2">
          <img src={game.background_image} alt={game.name} className="w-full h-auto rounded-lg" />
        </div>

        {/* Comment Section */}
        <div className="col-span-4 col-start-2 mt-6">
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
                <p><strong>{c.user.name}</strong>:</p> {/* แสดงชื่อผู้ใช้ */}
                <p>{c.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About Game */}
        <div className="col-start-2 col-end-4">
          <h3 className="font-bold text-lg">📝 ABOUT THIS GAME</h3>
          <p className="text-gray-600">{game.description_raw}</p>
        </div>
      </div>
    </main>
  );
}
