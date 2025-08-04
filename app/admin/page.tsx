"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import {
  Users,
  MessageSquare,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Types
type User = {
  id: string;
  name?: string;
  email?: string;
  createdAt?: any;
};

type Feedback = {
  id: string;
  name?: string;
  email?: string;
  message?: string;
  createdAt?: any;
};

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState<Feedback[]>([]);

  const router = useRouter();

  // 🔐 Secure admin check
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
const userDoc = await getDoc(doc(db, "users", user.uid));
console.log("Admin UID:", user.uid);
console.log("User document exists:", userDoc.exists());
console.log("User data:", userDoc.data());

const userData = userDoc.data();
    if (user.email !== "ahmed@gmail.com") {
      router.push("/sign-in");
      return;
    }

    // ✅ If email matches, user can stay on admin page
    console.log("Admin access granted");
  });

  return () => unsubscribe();
}, [router]);

  // 🚀 Fetch metrics and activity
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const feedbackSnap = await getDocs(collection(db, "feedback"));

        setUserCount(usersSnap.size);
        setFeedbackCount(feedbackSnap.size);

        const recentUserQuery = query(
          collection(db, "users"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const recentUsersSnap = await getDocs(recentUserQuery);
        setRecentUsers(
          recentUsersSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

        const recentFeedbackQuery = query(
          collection(db, "feedback"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const recentFeedbacksSnap = await getDocs(recentFeedbackQuery);
        setRecentFeedbacks(
          recentFeedbacksSnap.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || "",
              email: data.email || "",
              message: data.message || "",
              createdAt: data.createdAt || null,
            };
          })
        );
      } catch (err) {
        console.error("Error loading admin data:", err);
      }
    };

    fetchData();

    // 📦 GSAP animations with delay
    const timeout = setTimeout(() => {
      gsap.fromTo(
        ".metric-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        ".activity-item",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".activity-list",
            start: "top 80%",
          },
        }
      );
    }, 100);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const metrics = [
    {
      title: "Total Users",
      value: userCount,
      change: "+12%",
      icon: Users,
    },
    {
      title: "Total Feedbacks",
      value: feedbackCount,
      change: "+8%",
      icon: MessageSquare,
    },
    {
      title: "Active Sessions",
      value: "N/A",
      change: "–",
      icon: Activity,
    },
    {
      title: "Growth Rate",
      value: "N/A",
      change: "–",
      icon: TrendingUp,
    },
  ];

  const combinedActivity = [
    ...recentUsers.map((user) => ({
      id: user.id,
      user: user.name || user.email,
      action: "Signed up",
      time:
        user.createdAt && typeof user.createdAt.toDate === "function"
          ? user.createdAt.toDate().toLocaleString()
          : "Recently",
      type: "user",
    })),
    ...recentFeedbacks.map((f) => ({
      id: f.id,
      user: f.name || f.email,
      action: "Submitted feedback",
      time:
        f.createdAt && typeof f.createdAt.toDate === "function"
          ? f.createdAt.toDate().toLocaleString()
          : "Recently",
      type: "feedback",
    })),
  ].sort((a, b) => (a.time > b.time ? -1 : 1));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome back! Here's what's happening.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card
            key={metric.title}
            className="metric-card bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-gray-400">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-xs text-green-400 mt-1">
                {metric.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <p className="text-sm text-gray-400">
            Latest users and feedback events
          </p>
        </CardHeader>
        <CardContent>
          <div className="activity-list space-y-4">
            {combinedActivity.slice(0, 10).map((activity) => (
              <div
                key={activity.id}
                className="activity-item flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center text-white text-sm font-bold">
                    {activity.user
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-400">
                      {activity.action}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge
                    className={`capitalize ${
                      activity.type === "user"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {activity.type}
                  </Badge>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
