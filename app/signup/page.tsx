"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import { Stack } from "@/components/system";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Brand Section */}
      <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 to-violet-500 flex-col justify-center px-12 relative overflow-hidden">
        <div className="relative z-10 text-white max-w-lg">
          {/* Beta Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold uppercase mb-8 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-indigo-200" />
            Now in Beta
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
            The studio for{" "}
            <span className="text-indigo-200">intelligent</span> creators.
          </h1>
          <p className="text-lg text-white/70 max-w-lg leading-relaxed">
            Join thousands of teams building the next generation of AI-driven experiences with our intuitive design engine.
          </p>

          {/* Feature Cards */}
          <div className="mt-16 grid grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-indigo-200 text-2xl mb-2">✨</div>
              <h3 className="text-white font-semibold mb-1">AI Components</h3>
              <p className="text-white/50 text-sm">Drag and drop pre-built intelligence modules.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-indigo-200 text-2xl mb-2">⚡</div>
              <h3 className="text-white font-semibold mb-1">Instant Deploy</h3>
              <p className="text-white/50 text-sm">Ship to production in seconds with edge-runtime.</p>
            </div>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600 opacity-20 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-400 opacity-30 blur-[100px] rounded-full" />
      </aside>

      {/* Right Signup Column */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50 lg:bg-white">
        <div className="w-full max-w-md">
          <Stack spacing="lg">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
              <p className="text-gray-600 font-medium">Start building AI features today</p>
            </div>

            {/* Clerk SignUp Component */}
            <div>
              <SignUp routing="hash" forceRedirectUrl="/onboarding/step1" signInUrl="/login" />
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  Sign in
                </a>
              </p>
            </div>
          </Stack>
        </div>
      </section>
    </div>
  );
}
