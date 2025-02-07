"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // ใช้ไอคอนจาก lucide-react

export default function NavSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Button สำหรับเปิด/ปิด Sidebar */}
      <button
        className="p-2 text-white bg-blue-600 fixed top-4 left-4 z-50 rounded-full shadow-lg"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-blue-600 text-white w-64 z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="p-4 text-xl font-bold border-b border-blue-700">
          My Sidebar
        </div>
        <nav className="mt-4 space-y-4">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <span className="block px-4 py-2 hover:bg-blue-700 cursor-pointer">
              Home
            </span>
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>
            <span className="block px-4 py-2 hover:bg-blue-700 cursor-pointer">
              About
            </span>
          </Link>
          <Link href="/games" onClick={() => setIsOpen(false)}>
            <span className="block px-4 py-2 hover:bg-blue-700 cursor-pointer">
              Games
            </span>
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            <span className="block px-4 py-2 hover:bg-blue-700 cursor-pointer">
              Contact
            </span>
          </Link>
        </nav>
      </div>

      {/* Overlay เมื่อ Sidebar เปิด */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}
