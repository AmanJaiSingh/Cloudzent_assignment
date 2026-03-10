"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import { LogOut, Activity } from "lucide-react";

export function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-neutral-900 dark:text-neutral-50" />
          <span className="font-bold text-lg tracking-tight">Incidents</span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex flex-col items-end mr-2 text-sm">
              <div className="flex items-center gap-2 mb-1">
                {typeof user.team_id === "object" && user.team_id.name && (
                  <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                    {user.team_id.name}
                  </span>
                )}
                <span className="font-medium text-neutral-900 dark:text-neutral-50 leading-none">
                  {user.name}
                </span>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 leading-none">
                {user.email}
              </span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-neutral-600 dark:text-neutral-400">
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
