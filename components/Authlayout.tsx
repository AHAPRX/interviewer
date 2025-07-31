"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";

import { auth, db } from "@/firebase/client";
import Navbar from "@/components/Navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  const pathname = usePathname();
  const hideNavbarOnRoutes = ["/sign-in", "/sign-up"];
  const shouldShowNavbar = !!userId && !hideNavbarOnRoutes.includes(pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || "User");
          } else {
            setUserName("User");
          }
        } catch (error) {
          console.error("Failed to fetch user name:", error);
          setUserName("User");
        }
      } else {
        setUserId(null);
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {shouldShowNavbar && (
        <Navbar userId={userId!} userName={userName || "User"} />
      )}
      {children}
    </>
  );
}
