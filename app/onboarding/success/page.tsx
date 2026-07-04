"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Stack, Flex, Button } from "@/components/system";

export default function OnboardingSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const successEmit = new CustomEvent("onboarding-complete");
      window.dispatchEvent(successEmit);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 p-6 flex justify-center pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-lg font-bold text-gray-900">Aspire Studio</span>
        </div>
      </div>

      {/* Main Content */}
      <Container size="sm">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
          <Stack spacing="lg">
            {/* Progress Indicator */}
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
            </div>

            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-5xl">🎉</div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-gray-900">You're all set!</h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Your workspace is ready to go. Let's start creating something amazing.
              </p>
            </div>

            {/* Feature Preview */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100 text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">What you can do now:</p>
                <ul className="flex flex-wrap gap-3 justify-center text-sm text-gray-600">
                  <li>✨ Generate AI content</li>
                  <li>📊 Manage projects</li>
                  <li>🔑 Create API keys</li>
                  <li>👥 Invite teammates</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <Stack spacing="md">
              <Button
                fullWidth
                onClick={() => router.push("/dashboard")}
                className="text-lg h-12"
              >
                Go to Dashboard →
              </Button>

              {/* Secondary Actions */}
              <Flex gap="sm" justify="center">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  Invite teammates
                </a>
                <span className="w-1 h-1 rounded-full bg-gray-300 self-center" />
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  View docs
                </a>
              </Flex>
            </Stack>

            {/* Footer Note */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                🔒 Your data is secure and encrypted
              </p>
            </div>
          </Stack>
        </div>
      </Container>
    </div>
  );
}
