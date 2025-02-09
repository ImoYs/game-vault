// // src/app/auth/signin.tsx

// "use client";
// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function SignInPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleLogin = async (provider?: string) => {
//     setError("");

//     if (provider) {
//       await signIn(provider);
//       return;
//     }

//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (result?.error) {
//       setError("Invalid email or password");
//     } else {
//       router.push("/");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-2xl font-bold">Sign In</h1>

//       {error && <p className="text-red-500">{error}</p>}

//       <div className="mt-4 space-y-3">
//         {/* Google Login */}
//         <button
//           onClick={() => handleLogin("google")}
//           className="w-64 bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Sign in with Google
//         </button>

//         {/* Email/Password Login */}
//         <div className="border p-4 rounded w-64">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-2 py-1 border rounded"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-2 py-1 border rounded mt-2"
//           />
//           <button
//             onClick={() => handleLogin()}
//             className="w-full bg-green-500 text-white px-4 py-2 mt-2 rounded"
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// 
