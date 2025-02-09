"use client";
export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
      <p className="text-gray-700">Something went wrong. Please try again.</p>
      <a href="/auth/signin" className="mt-4 text-blue-500 hover:underline">
        Back to Sign In
      </a>
    </div>
  );
}
