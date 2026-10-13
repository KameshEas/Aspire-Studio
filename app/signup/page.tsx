"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-var(--color-bg) text-var(--color-text) flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-20 bg-gradient-to-br from-var(--color-primary-600) to-var(--color-primary-900) animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-15 bg-gradient-to-tl from-var(--color-primary-400) to-var(--color-primary-600)" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Logo & Badge Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-var(--color-border) mb-4 text-xs font-semibold uppercase tracking-wide text-var(--color-text-secondary)">
            <span className="w-2 h-2 rounded-full bg-var(--color-primary-500)" />
            <span>Now in Beta</span>
          </div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-var(--color-primary-600) to-var(--color-primary-500) mb-4 shadow-lg">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Aspire Studio</h1>
          <p className="mt-2 text-var(--color-text-secondary) text-lg">The studio for intelligent creators</p>
        </div>

        {/* Main Auth Card */}
        <div className="w-full max-w-md">
          <div className="bg-var(--color-surface-1) rounded-2xl border border-var(--color-border) p-8 sm:p-10 shadow-lg backdrop-blur-sm">
            {/* Card Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Create your account</h2>
              <p className="text-var(--color-text-secondary)">Start building AI features today</p>
            </div>

            {/* Signup Form */}
            <div className="w-full [&_*]:transition-all [&_*]:duration-300">
              <SignUp routing="hash" forceRedirectUrl="/onboarding/step1" signInUrl="/login" />
            </div>

            {/* Divider with text */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-var(--color-border)" />
              <span className="text-sm text-var(--color-text-muted)">or</span>
              <div className="flex-1 h-px bg-var(--color-border)" />
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-var(--color-text-secondary)">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-var(--color-primary-600) font-semibold hover:text-var(--color-primary-700) transition-colors underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-var(--color-surface-1) border border-var(--color-border) hover:border-var(--color-primary-500) transition-colors">
              <div className="text-xl mb-2">✨</div>
              <h3 className="text-sm font-semibold mb-1">AI Components</h3>
              <p className="text-xs text-var(--color-text-muted)">Pre-built intelligence</p>
            </div>
            <div className="p-4 rounded-lg bg-var(--color-surface-1) border border-var(--color-border) hover:border-var(--color-primary-500) transition-colors">
              <div className="text-xl mb-2">⚡</div>
              <h3 className="text-sm font-semibold mb-1">Instant Deploy</h3>
              <p className="text-xs text-var(--color-text-muted)">Ship in seconds</p>
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
