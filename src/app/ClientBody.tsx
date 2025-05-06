"use client";

import { useEffect } from "react";
import { UserProvider } from "@/context/UserContext";

interface DialogStateDetail {
  isOpen: boolean;
}

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased font-sans overflow-x-hidden";

    // Add listener to prevent body scrolling when modals are open
    const handleBodyScroll = (e: CustomEvent<DialogStateDetail>) => {
      if (e.detail?.isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    // Using type assertion to handle custom event
    window.addEventListener(
      "dialog-state-change",
      handleBodyScroll as EventListener
    );

    return () => {
      window.removeEventListener(
        "dialog-state-change",
        handleBodyScroll as EventListener
      );
    };
  }, []);

  return (
    <UserProvider>
      <div className="flex min-h-screen flex-col antialiased bg-background px-4 py-0 md:px-6">
        {children}
      </div>
    </UserProvider>
  );
}
