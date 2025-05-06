"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BellIcon, InfoIcon } from "lucide-react";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-10 bg-card soft-shadow">
      <div className="container flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight primary-gradient bg-clip-text text-transparent">
            EarnIt
          </span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-muted-foreground rounded-full hover:bg-muted transition-colors">
            <InfoIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted-foreground rounded-full hover:bg-muted transition-colors">
            <BellIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
