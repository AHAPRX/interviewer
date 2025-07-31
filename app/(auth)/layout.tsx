"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/"); // ✅ already signed in → redirect to home
      } else {
        setCheckingAuth(false); // ✅ not signed in → show page
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) return null; // 🔄 Wait before showing auth page

  return <div className="auth-layout">{children}</div>;
}
