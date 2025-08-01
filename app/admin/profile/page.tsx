"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/client"
import { useRouter } from "next/navigation"

export default function AdminProfilePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAdminData = async () => {
      const user = auth.currentUser
      if (!user) return

      try {
        const docRef = doc(db, "users", user.uid)
        const snap = await getDoc(docRef)

        if (snap.exists()) {
          const data = snap.data()
          setName(data.name || "")
          setEmail(data.email || "")
        }
      } catch (err) {
        console.error("Failed to fetch admin profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

 const handleUpdate = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, { name, email }, { merge: true });
    alert("Profile updated!");
    router.push("/admin");
  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update profile.");
  }
};


  if (loading) return <div className="p-8 text-gray-300">Loading...</div>

  return (
    <div className="max-w-xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
      <Input
        className="bg-white/5 border-white/10 text-white"
        value={name}
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        className="bg-white/5 border-white/10 text-white"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600">
        Update Profile
      </Button>
    </div>
  )
}
