// LoadingDots.tsx
import React from "react";
import "./LoadingDots.css";  // นำเข้าไฟล์ CSS สำหรับ loading

export default function LoadingDots() {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
}
