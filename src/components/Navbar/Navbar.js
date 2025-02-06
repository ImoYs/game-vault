import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link href="/">My Website</Link>
        </div>
        <div className="space-x-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/games" className="hover:underline">
            Games
          </Link>
          <Link href="/account" className="hover:underline">
          account
          </Link>
        </div>
      </div>
    </nav>
  );
}
