// export default function Page() {
//     return <p>Customers Page</p>;
//   }
// app/profile/page.tsx
'use client'
import { useSession } from "next-auth/react"

const Profile = () => {
  const { data: session } = useSession()

  if (!session) {
    return <p>Please sign in</p>
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>{session.user?.email}</p>
    </div>
  )
}

export default Profile
