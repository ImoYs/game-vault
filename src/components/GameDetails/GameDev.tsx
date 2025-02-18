"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchGameDevelopmentTeam } from "@/utils/api/Devteam"; // ฟังก์ชันที่ใช้ดึงข้อมูลจาก API

export default function GameDevelopmentTeam() {
  const { id } = useParams();
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลจาก API
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!id) return;
      try {
        const response = await fetchGameDevelopmentTeam(Array.isArray(id) ? id[0] : id);
        setTeam(response); // แสดงผลใน state team
        setLoading(false);
      } catch (error) {
        console.error("Error fetching development team:", error);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id]);

  if (loading) {
    return <p>Loading development team...</p>;
  }

  return (
    <div>
      <h3 className="font-bold text-lg">👥 Development Team</h3>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {team.length === 0 ? (
          <p>No team members available.</p>
        ) : (
          team.map((member: any) => (
            <div key={member.id} className="text-center">
              <img src={member.image} alt={member.name} className="w-20 h-20 object-cover rounded-full mx-auto" />
              <h4 className="font-semibold mt-2">{member.name}</h4>
              <p className="text-sm text-gray-500">{member.games_count} games</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
