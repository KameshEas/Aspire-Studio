"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "@/lib/hooks/useFormState";
import { useToast } from "@/lib/hooks/useToast";
import {
  Container,
  Stack,
  Flex,
  Button,
  Form,
  FormField,
  Input,
} from "@/components/system";

export default function OnboardingStep1Page() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  const form = useFormState({
    initialValues: { orgName: "", slug: "" },
    validate: (v) => ({
      ...(v.orgName.length === 0 && { orgName: "Organization name required" }),
      ...(v.orgName.length < 2 && v.orgName.length > 0 && { orgName: "Min 2 characters" }),
      ...(v.slug.length === 0 && { slug: "Workspace URL required" }),
      ...(v.slug.length < 2 && v.slug.length > 0 && { slug: "Min 2 characters" }),
      ...(!v.slug.match(/^[a-z0-9-]+$/) && v.slug.length > 0 && { slug: "Only lowercase letters, numbers, and hyphens" }),
    }),
    onSubmit: async (v) => {
      try {
        success({
          title: "Workspace created",
          description: `Welcome to ${v.orgName}!`,
        });
        setTimeout(() => {
          router.push("/onboarding/success");
        }, 1000);
      } catch (err) {
        showError({
          title: "Failed to create workspace",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    if (form.values.orgName && !form.touched.slug) {
      form.setValue("slug", generateSlug(form.values.orgName));
    }
  }, [form.values.orgName]);

  const previewUrl = form.values.slug ? `aspire.studio/${form.values.slug}` : "aspire.studio/workspace";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      {/* Logo Header */}
      <div className="mb-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Aspire Studio</span>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2">
          <div className="h-1.5 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-500" />
          <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[640px] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8 md:p-12">
          <Stack spacing="lg">
            {/* Heading */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Set up your workspace</h1>
              <p className="text-gray-600 text-lg">Let's get started by naming your creative environment.</p>
            </div>

            {/* Form */}
            <Form onSubmit={form.handleSubmit}>
              <Stack spacing="lg">
                {/* Organization Name */}
                <FormField
                  label="Organization Name"
                  description="This is your workspace name"
                  error={form.getError("orgName")}
                  required
                >
                  <Input
                    placeholder="e.g., Acme Design Studio"
                    {...form.getFieldProps("orgName")}
                  />
                </FormField>

                {/* Workspace URL */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900">Workspace URL</label>
                    {form.values.slug && (
                      <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                        ✓ Available
                      </span>
                    )}
                  </div>
                  <FormField error={form.getError("slug")}>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-600 text-sm font-medium">
                        aspire.studio/
                      </div>
                      <Input
                        placeholder="workspace-url"
                        className="pl-32"
                        {...form.getFieldProps("slug")}
                      />
                    </div>
                  </FormField>

                  {/* URL Preview */}
                  {form.values.slug && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                      <span className="text-xs font-medium text-blue-900">Preview:</span>
                      <code className="text-xs text-blue-700 font-mono">https://{previewUrl}</code>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="text-sm bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <p className="text-amber-900 font-medium mb-1">ℹ️ You can change these settings later</p>
                  <p className="text-amber-800 text-xs">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={form.isSubmitting}
                  disabled={!form.isValid}
                  className="w-full"
                >
                  Continue →
                </Button>
              </Stack>
            </Form>
          </Stack>
        </div>
      </div>
    </div>
  );
}
