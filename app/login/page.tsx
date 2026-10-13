"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-var(--color-bg) text-var(--color-text) flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-20 bg-gradient-to-br from-var(--color-primary-600) to-var(--color-primary-900) animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-15 bg-gradient-to-tl from-var(--color-primary-400) to-var(--color-primary-600)" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-var(--color-primary-600) to-var(--color-primary-500) mb-4 shadow-lg">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Aspire Studio</h1>
          <p className="mt-2 text-var(--color-text-secondary) text-lg">Build AI features, faster</p>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md">
          <div className="bg-var(--color-surface-1) rounded-2xl border border-var(--color-border) p-8 sm:p-10 shadow-lg backdrop-blur-sm">
            {/* Card Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back</h2>
              <p className="text-var(--color-text-secondary)">Sign in to your workspace</p>
            </div>

            {/* Auth Form */}
            <div className="w-full [&_*]:transition-all [&_*]:duration-300">
              <SignIn routing="hash" forceRedirectUrl="/onboarding/step1" signUpUrl="/signup" />
            </div>

            {/* Divider with text */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-var(--color-border)" />
              <span className="text-sm text-var(--color-text-muted)">or</span>
              <div className="flex-1 h-px bg-var(--color-border)" />
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-var(--color-text-secondary)">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-var(--color-primary-600) font-semibold hover:text-var(--color-primary-700) transition-colors underline"
                >
                  Create one
                </a>
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-var(--color-text-muted)">
            <a href="#" className="hover:text-var(--color-text-secondary) transition-colors">
              Privacy
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-var(--color-text-secondary) transition-colors">
              Terms
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-var(--color-text-secondary) transition-colors">
              Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
