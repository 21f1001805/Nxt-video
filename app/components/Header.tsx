"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-900"
          onClick={() => showNotification("Welcome to NXT Video", "info")}
        >
          NXT Video
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {session?.user?.email ? session.user.email.split("@")[0] : "Account"}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-slate-200 bg-white p-2 shadow-lg">
              {session ? (
                <>
                  <Link
                    href="/upload"
                    className="block rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => {
                      setMenuOpen(false);
                      showNotification("Ready to upload your next video", "info");
                    }}
                  >
                    Upload Video
                  </Link>
                  <button
                    type="button"
                    className="mt-1 block w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => {
                    setMenuOpen(false);
                    showNotification("Please sign in to continue", "info");
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
