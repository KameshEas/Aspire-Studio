"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingStep1Page() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [slug, setSlug] = useState("acme-studio");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: persist workspace to backend or user metadata
    router.push("/onboarding/success");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface selection:bg-primary/20">
      <div className="mb-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/30">
            <span className="text-white font-bold text-2xl tracking-tighter">A</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-on-surface">Aspire Studio</span>
        </div>

        <div className="flex gap-2 mb-2">
          <div className="h-1.5 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-500" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/90" />
        </div>
      </div>

      <main className="w-full max-w-[640px] bg-white rounded-3xl shadow-xl shadow-neutral-900/5 border border-surface-container overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-3">Set up your workspace</h1>
            <p className="text-on-surface-variant text-lg">Let's get started by naming your creative environment.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="org-name">Organization name</label>
              <div className="relative">
                <input
                  id="org-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Acme Design Studio"
                  className="w-full h-14 px-5 bg-surface-container-low border-0 rounded-2xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                  type="text"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end ml-1">
                <label className="block text-sm font-semibold text-on-surface" htmlFor="workspace-url">Workspace URL</label>
                <span className="text-[11px] font-bold text-green-600 flex items-center gap-1 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 700" }}>check_circle</span>
                  Available
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-outline text-lg">aspire.studio/</div>
                <input
                  id="workspace-url"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full h-14 pl-[124px] pr-12 bg-surface-container-low border-0 rounded-2xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
                  type="text"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </div>

              <div className="flex items-center justify-center pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full">
                  <span className="text-xs font-medium text-primary">Preview:</span>
                  <span className="text-xs font-semibold text-primary/80">https://aspire.studio/{slug}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200/25 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg">
                Continue
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>

        <div className="bg-surface-container-low px-8 py-5 border-t border-surface-container/50 text-center">
          <p className="text-xs text-on-surface-variant leading-relaxed">You can change these settings later in your <span className="font-semibold">Workspace Settings</span>. By continuing, you agree to our Terms of Service.</p>
        </div>
      </main>
    </div>
  );
}
