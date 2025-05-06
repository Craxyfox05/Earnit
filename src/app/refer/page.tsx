"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReferRoute() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to tasks page with a URL parameter to show referral section
    router.push("/tasks?openReferral=true");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Redirecting to referral program...</p>
      </div>
    </div>
  );
}
