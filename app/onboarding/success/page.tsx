"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function OnboardingSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9FAFB] text-on-surface">
      <header className="fixed top-8 w-full flex justify-center pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg select-none">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Aspire Studio</span>
        </div>
      </header>

      <main className="w-full max-w-[640px] bg-white/70 backdrop-blur-md rounded-3xl p-12 flex flex-col items-center text-center shadow-xl">
        <div className="flex gap-2 mb-6 mt-6">
          <div className="w-2 h-2 rounded-full bg-neutral-200" />
          <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(70,72,212,0.4)]" />
        </div>

        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>

        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-extrabold">You're all set!</h1>
          <p className="text-lg text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Your workspace <span className="font-semibold">Acme Studio</span> is ready. Let's build something.
          </p>
        </div>

        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8 bg-surface-container-low relative">
          <img className="w-full h-full object-cover opacity-60 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtmUrLTUUu2I07QSVXrLU0BMpfYs5PRjCv8Av0jII1RjmbPcGOivnqWqDOsBprYlaGcZnEbz5dU9vjksOD47v1zIiuVT9libEsCNQJldZumEHxs6W8_9qVw_Wvjaem2kjz5FjiJdF8tQGIvnh8MOf670J2qDWdH2Bk2T7SLKUgO9fb95-kvensA6wEbkcrhaogl9YrB0mAYyWB9iCIAU72OVrQMtWNw28-9Z_y-kdaLBZE6oOzenfyIZKM3oso_rWEi0kcS87FcYM" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
        </div>

        <div className="w-full space-y-4">
          <button onClick={() => router.push('/dashboard')} className="w-full py-4 px-6 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg">
            Go to Dashboard
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>

          <div className="flex items-center justify-center gap-4 text-sm font-medium text-on-surface-variant">
            <a className="hover:text-indigo-600" href="#">Invite teammates</a>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <a className="hover:text-indigo-600" href="#">Read the docs</a>
          </div>
        </div>
      </main>

      <footer className="mt-12 opacity-50">
        <p className="text-xs text-neutral-400 font-medium tracking-widest uppercase">Secured by Aspire Intelligence</p>
      </footer>
    </div>
  );
}
