"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { Container, Stack, Flex } from "@/components/system";

export default function LoginPage() {
  const bgUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFW5emi0pc1kNJiW8HVpX9v0PV33R2IiVcOFT9UJO5nq-mud0MOrKZEvLQG1dUwHYiGLc4P93glTRSRwdIXrZOyYsTjCLE7PAXE7HIhyzMThfXG6ogxc0i2GV5prqzx50bSaziw7VCXTSSGTAnkc5_5lHwLfHA-ADyGtTxrRSjPp8tISz59Fw_dpYPxf8pfbNrAIX7J1WAj9Gv2hpdpZbUgBWg_o_xhFTKDq_qzSNtA6qlbZgaaTKyrksaHg7VRSINF97UdGqgzUk";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Hero Section */}
      <aside className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-700 to-violet-500 relative overflow-hidden items-center justify-center p-12">
        {/* Gradient Backgrounds */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -left-24 w-[60%] h-[60%] rounded-full bg-white blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-[50%] h-[50%] rounded-full bg-teal-300 blur-[100px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-700 font-bold text-lg">
              A
            </div>
            <span className="text-2xl font-bold tracking-tight">Aspire Studio</span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight leading-tight mb-4">Build AI features, faster.</h2>
          <p className="text-lg text-indigo-100/80">
            The intelligence layer for your next generation of applications. Deploy with precision and style.
          </p>
        </div>

        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: `url('${bgUrl}')`, backgroundSize: "cover" }}
        />
      </aside>

      {/* Right Auth Column */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-gray-50 md:bg-white">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-lg font-bold text-gray-900">Aspire Studio</span>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10 md:shadow-[0_12px_40px_rgba(70,72,212,0.06)]">
          <Stack spacing="lg">
            {/* Header */}
            <div>
              <div className="hidden md:flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="text-lg font-bold">Aspire Studio</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to your workspace</p>
            </div>

            {/* Clerk SignIn Component */}
            <div className="w-full">
              <SignIn routing="hash" forceRedirectUrl="/onboarding/step1" signUpUrl="/signup" />
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                  Sign up
                </a>
              </p>
            </div>
          </Stack>
        </div>

        {/* Footer Links */}
        <footer className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-xs text-gray-500 uppercase tracking-wide">
          <a href="#" className="hover:text-gray-700 transition-colors">
            Privacy Policy
          </a>
          <span className="hidden md:inline text-gray-300">•</span>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Terms of Service
          </a>
          <span className="hidden md:inline text-gray-300">•</span>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Help Center
          </a>
        </footer>
      </main>
    </div>
  );
}
