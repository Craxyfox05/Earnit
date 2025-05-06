"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ListTodo,
  Wallet,
  User
} from "lucide-react";

export function MobileFooter() {
  const pathname = usePathname();

  return (
    <footer className="sticky bottom-0 z-10 bg-card card-bg shadow-floating py-2 mt-auto border-t">
      <div className="container">
        <nav className="flex items-center justify-between">
          <NavItem
            icon={<Home className="w-5 h-5" />}
            label="Home"
            href="/"
            active={pathname === '/'}
          />
          <NavItem
            icon={<ListTodo className="w-5 h-5" />}
            label="Tasks"
            href="/tasks"
            active={pathname === '/tasks'}
          />
          <NavItem
            icon={<Wallet className="w-5 h-5" />}
            label="Wallet"
            href="/wallet"
            active={pathname === '/wallet'}
          />
          <NavItem
            icon={<User className="w-5 h-5" />}
            label="Profile"
            href="/profile"
            active={pathname === '/profile'}
          />
        </nav>
      </div>
    </footer>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ icon, label, href, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 px-4 py-1 rounded-lg transition-colors scale-on-tap ${
        active
          ? "primary-text"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
