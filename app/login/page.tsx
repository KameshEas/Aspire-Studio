"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import Card from "../../components/Card";

export default function LoginPage() {
  const bgUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFW5emi0pc1kNJiW8HVpX9v0PV33R2IiVcOFT9UJO5nq-mud0MOrKZEvLQG1dUwHYiGLc4P93glTRSRwdIXrZOyYsTjCLE7PAXE7HIhyzMThfXG6ogxc0i2GV5prqzx50bSaziw7VCXTSSGTAnkc5_5lHwLfHA-ADyGtTxrRSjPp8tISz59Fw_dpYPxf8pfbNrAIX7J1WAj9Gv2hpdpZbUgBWg_o_xhFTKDq_qzSNtA6qlbZgaaTKyrksaHg7VRSINF97UdGqgzUk';

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left hero (hidden on small screens) */}
      <aside className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-700 to-violet-500 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -left-24 w-[60%] h-[60%] rounded-full bg-white blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-[50%] h-[50%] rounded-full bg-teal-300 blur-[100px]" />
        </div>

        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-700">
              <AspireLogoIcon />
            </div>
            <span className="text-2xl font-bold tracking-tight">Aspire Studio</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">Build AI features, faster.</h2>
          <p className="text-lg text-indigo-100/80">The intelligence layer for your next generation of applications. Deploy with precision and style.</p>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `url('${bgUrl}')`, backgroundSize: 'cover' }} />
      </aside>

      {/* Right auth column */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
        <div className="md:hidden flex items-center space-x-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center text-white">
            <AspireLogoIcon />
          </div>
          <span className="text-xl font-bold">Aspire Studio</span>
        </div>

        <Card className="w-full max-w-[480px] rounded-full p-10 md:shadow-[0_12px_40px_rgba(70,72,212,0.06)]">
          <div className="mb-8 text-center md:text-left">
            <div className="hidden md:flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center text-white">
                <AspireLogoIcon />
              </div>
              <span className="text-lg font-bold">Aspire Studio</span>
            </div>

            <h1 className="text-3xl font-bold mb-1">Welcome back</h1>
            <p className="text-sm text-gray-600">Sign in to your workspace</p>
          </div>

          <div className="w-full">
            <SignIn routing="hash" forceRedirectUrl="/onboarding/step1" signUpUrl="/signup" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account? <a href="/signup" className="text-indigo-600 font-semibold">Sign up</a></p>
          </div>
        </Card>

        <footer className="mt-8 flex space-x-6 text-xs text-gray-400 uppercase tracking-wide">
          <a href="#" className="hover:text-gray-600">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600">Terms of Service</a>
          <a href="#" className="hover:text-gray-600">Help Center</a>
        </footer>
      </main>
    </div>
  );
}

function AspireLogoIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="white" fillOpacity="0.12" />
      <path d="M10 26L18 10L26 26" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M13 21h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="rgba(255,255,255,0.15)" />
      <path d="M5 8l2.5 2.5L11 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
