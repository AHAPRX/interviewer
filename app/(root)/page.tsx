import Link from "next/link";
import Image from "next/image";
import { Suspense, Component, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: string }
> {
  state = { hasError: false, error: "" };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-message">
          <p>Error: {this.state.error}</p>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

async function Home() {
  const user = await getCurrentUser();
  const userId = user?.id ?? "";

  // Fetch data with error handling
  const [userInterviews, allInterviews] = await Promise.all([
    getInterviewsByUserId(userId).catch(() => []),
    getLatestInterviews({ userId }).catch(() => []),
  ]);

  // Debug logging to inspect API responses
  console.log("userInterviews:", userInterviews);
  console.log("allInterviews:", allInterviews);

  // Ensure arrays to prevent map errors
  const safeUserInterviews = Array.isArray(userInterviews) ? userInterviews : [];
  const safeAllInterviews = Array.isArray(allInterviews) ? allInterviews : [];

  return (
    <>
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
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
          priority
        />
      </section>

      <Suspense fallback={<p>Loading interviews...</p>}>
        <ErrorBoundary>
          <section className="flex flex-col gap-6 mt-8">
            <h2>Your Interviews</h2>
            <div className="interviews-section">
              {safeUserInterviews.length > 0 ? (
                safeUserInterviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={userId}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                ))
              ) : (
                <p>You haven&apos;t taken any interviews yet</p>
              )}
            </div>
          </section>
        </ErrorBoundary>

        <ErrorBoundary>
          <section className="flex flex-col gap-6 mt-8">
            <h2>Take Interviews</h2>
            <div className="interviews-section">
              {safeAllInterviews.length > 0 ? (
                safeAllInterviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={userId}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                ))
              ) : (
                <p>There are no interviews available</p>
              )}
            </div>
          </section>
        </ErrorBoundary>
      </Suspense>
    </>
  );
}

export default Home;