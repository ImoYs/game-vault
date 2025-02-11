"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar"; // ✅ นำเข้า Navbar

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!session) {
    return <p>Please log in to manage your account.</p>;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/account/update", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      if (res.ok) {
        await signOut({ redirect: false }); // ✅ ออกจากระบบก่อน
        router.push("/"); // ✅ กลับไปหน้า Home
      } else {
        setMessage("Failed to delete account.");
      }
    }
  };

  return (
    <>
      <Navbar /> {/* ✅ เพิ่ม Navbar */}
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        {message && <p className="text-red-500">{message}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Update Account
          </button>
        </form>

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white p-2 rounded mt-4"
        >
          Delete Account
        </button>
      </div>
    </>
  );
}
