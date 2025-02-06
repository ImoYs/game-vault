// src/app/auth/signin.tsx

"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  const handleLogin = async () => {
    const result = await signIn("credentials", {
      email: "test@example.com", // ใช้ข้อมูลที่ตรงกับที่กำหนดใน authorize
      password: "password123", // รหัสผ่านที่ตรงกับที่กำหนดใน authorize
    });

    if (result?.error) {
      alert("Login failed");
    } else {
      window.location.href = "/"; // เปลี่ยนเส้นทางหลังจากล็อกอิน
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
