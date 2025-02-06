"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>⚠️ Oops! Something went wrong.</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>🔄 Try Again</button>
    </div>
  );
}
