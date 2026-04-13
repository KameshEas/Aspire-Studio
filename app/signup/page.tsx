"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import Card from "../../components/Card";

export default function SignupPage() {
  const bgUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFW5emi0pc1kNJiW8HVpX9v0PV33R2IiVcOFT9UJO5nq-mud0MOrKZEvLQG1dUwHYiGLc4P93glTRSRwdIXrZOyYsTjCLE7PAXE7HIhyzMThfXG6ogxc0i2GV5prqzx50bSaziw7VCXTSSGTAnkc5_5lHwLfHA-ADyGtTxrRSjPp8tISz59Fw_dpYPxf8pfbNrAIX7J1WAj9Gv2hpdpZbUgBWg_o_xhFTKDq_qzSNtA6qlbZgaaTKyrksaHg7VRSINF97UdGqgzUk';

  return (
    <div className="min-h-screen flex">
      {/* Left brand: visible on large screens */}
      <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 to-violet-500 flex-col justify-center px-24 relative overflow-hidden">
        <div className="relative z-10 text-white max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold uppercase mb-8 border border-white/5">
            <span className="w-2 h-2 rounded-full bg-indigo-200"></span>
            Now in Beta
          </div>

          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">The studio for <span className="text-indigo-200">intelligent</span> creators.</h1>
          <p className="text-lg text-white/70 max-w-lg leading-relaxed font-light">Join over 10,000 teams building the next generation of AI-driven experiences with our intuitive design engine.</p>

          <div className="mt-16 grid grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-indigo-200 text-2xl">★</div>
              <h3 className="text-white font-semibold mb-1">AI Components</h3>
              <p className="text-white/50 text-sm">Drag and drop pre-built intelligence modules.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-indigo-200 text-2xl">⚡</div>
              <h3 className="text-white font-semibold mb-1">Instant Deploy</h3>
              <p className="text-white/50 text-sm">Ship to production in seconds with edge-runtime.</p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600 opacity-20 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-400 opacity-30 blur-[100px] rounded-full" />
      </aside>

      {/* Right signup column */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-[480px] bg-white p-10 rounded-xl">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Create your account</h2>
            <p className="text-gray-600 font-medium">Start building AI features today</p>
          </div>

          <div>
            <SignUp routing="hash" forceRedirectUrl="/onboarding/step1" signInUrl="/login" />
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-gray-400">or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700 text-sm">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700 text-sm">
              GitHub
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-gray-600">Already have an account? <a className="text-indigo-600 hover:text-indigo-700 font-bold ml-1" href="/login">Sign in</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
