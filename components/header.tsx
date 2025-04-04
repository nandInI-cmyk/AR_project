"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            <path d="M12 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            <circle cx="12" cy="12" r="10" />
            <path d="M18 12h-5" />
            <path d="M7 12h3" />
          </svg>
          <span className="text-xl font-bold">Guitar AR</span>
        </Link>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/songs" className="text-sm font-medium hover:underline">
              Songs
            </Link>
            <Link href="/progress" className="text-sm font-medium hover:underline">
              My Progress
            </Link>
            <Link href="/help" className="text-sm font-medium hover:underline">
              Help
            </Link>
          </nav>
          <ModeToggle />
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  )
}

