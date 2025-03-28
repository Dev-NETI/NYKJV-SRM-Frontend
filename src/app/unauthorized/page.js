"use client";
import React from "react";
import Link from "next/link";
import { LogoutRounded } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useAuth } from "@/hooks/auth";

function Unauthorized() {
  const { logout } = useAuth({
    middleware: "auth",
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-md w-full">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, you don&apos;t have permission to access this page. Please log
          in or contact an administrator.
        </p>
        <div className="flex justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <svg
              className="mr-2 -ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>

          <Button variant="solid" color="danger" onClick={logout}>
            <LogoutRounded />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
