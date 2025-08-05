import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

// ✅ Reusable Interview Section Component
interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
}

interface InterviewSectionProps {
  title: string;
  interviews: Interview[];
  emptyMessage: string;
  userId: string;
}

function InterviewSection({
  title,
  interviews,
  emptyMessage,
  userId,
}: InterviewSectionProps) {
  if (!Array.isArray(interviews) || interviews.length === 0) {
    return (
      <section className="flex flex-col gap-6 mt-8">
        <h2>{title}</h2>
        <p>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 mt-8">
      <h2>{title}</h2>
      <div className="interviews-section">
        {interviews.map((interview) => (
          <InterviewCard
            key={interview.id}
            userId={userId}
            interviewId={interview.id}
            role={interview.role}
            type={interview.type}
            techstack={interview.techstack}
            createdAt={interview.createdAt}
          />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || "";

    const [userInterviewsRaw, latestInterviewsRaw] = await Promise.all([
      getInterviewsByUserId(userId),
      getLatestInterviews({ userId }),
    ]);

    const userInterviews = Array.isArray(userInterviewsRaw) ? userInterviewsRaw : [];
    const latestInterviews = Array.isArray(latestInterviewsRaw) ? latestInterviewsRaw : [];

    return (
      <>
        {/* Hero Section */}
        <section className="card-cta">
          <div className="flex flex-col gap-6 max-w-lg">
            <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
            <p className="text-lg">
              Practice real interview questions & get instant feedback
            </p>

            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>

          <Image
            src="/robot.png"
            alt="Robot"
            width={400}
            height={400}
            className="max-sm:hidden"
          />
        </section>

        {/* Reused Interview Sections */}
        <InterviewSection
          title="Your Interviews"
          interviews={userInterviews}
          emptyMessage="You haven't taken any interviews yet."
          userId={userId}
        />

        <InterviewSection
          title="Take Interviews"
          interviews={latestInterviews}
          emptyMessage="There are no interviews available."
          userId={userId}
        />
      </>
    );
  } catch (error) {
    console.error("Error loading home page:", error);
    return (
      <section className="mt-10 text-center">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-gray-500">We couldn’t load your data. Please try again later.</p>
      </section>
    );
  }
}
