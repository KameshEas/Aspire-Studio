"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useModels, useGenerate, useGenerateAsync } from "../../../../../lib/hooks";
import { useToast } from "../../../../../lib/hooks/useToast";

import {
  Container,
  Stack,
  Textarea,
  Button,
  ProcessingState,
  ErrorState,
  LoadingState,
} from "../../../../../components/system";

export default function StudioPage() {
  const params = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const projectId = params.projectId;
  const orgId = activeOrgId ?? "";

  const { data: models, isLoading: modelsLoading } = useModels();
  const generate = useGenerate(orgId, projectId);
  const generateAsync = useGenerateAsync(orgId, projectId);

  const [model, setModel] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"sync" | "async">("sync");
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Initialize model
  useEffect(() => {
    if (!model && models?.length) {
      setModel(models[0].id);
    }
  }, [models, model]);

  // Timer for progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setElapsed(0);

    try {
      const data = { model, prompt };

      if (mode === "sync") {
        await generate.mutateAsync(data as any);
      } else {
        await generateAsync.mutateAsync(data as any);
      }

      success({
        title: mode === "sync" ? "Generation complete!" : "Job queued!",
        description: mode === "sync"
          ? "Your content is ready"
          : "Processing in background. Check History soon.",
        action: {
          label: "View Results",
          onClick: () => router.push(`/projects/${projectId}/generations`),
        },
      });

      router.push(`/projects/${projectId}/generations`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setGenerationError(errorMsg);
      showError({
        title: "Generation failed",
        description: errorMsg,
      });
    } finally {
      setIsGenerating(false);
      setElapsed(0);
    }
  };

  const selectedModel = models?.find((m) => m.id === model);

  // Show loading while fetching models
  if (modelsLoading) {
    return <LoadingState message="Loading available models..." />;
  }

  // Show error if no models available
  if (!models?.length) {
    return (
      <Container>
        <ErrorState
          title="No models available"
          message="No AI models are configured for this workspace."
          action={{
            label: "Go to Settings",
            onClick: () => router.push(`/projects/${projectId}/settings`),
          }}
          secondaryAction={{
            label: "Go Back",
            onClick: () => router.back(),
          }}
        />
      </Container>
    );
  }

  // Show progress during generation
  if (isGenerating) {
    return (
      <ProcessingState
        title={mode === "sync" ? "Generating Content" : "Queuing Generation"}
        message={`Using ${selectedModel?.name || "AI model"}...`}
        elapsed={elapsed}
        estimated={mode === "sync" ? 30 : 5}
        onCancel={() => {
          setIsGenerating(false);
          setElapsed(0);
        }}
        steps={[
          { label: "Validating prompt", status: "completed" },
          { label: "Preparing request", status: "completed" },
          {
            label: mode === "sync" ? "Calling AI model" : "Queuing job",
            status: elapsed > 2 ? "processing" : "pending",
          },
          {
            label: mode === "sync" ? "Creating artifact" : "Scheduling execution",
            status: elapsed > 5 ? "processing" : "pending",
          },
        ]}
      />
    );
  }

  // Show error state if generation failed
  if (generationError) {
    return (
      <Container>
        <ErrorState
          title="Generation Failed"
          message={generationError}
          action={{
            label: "Try Again",
            onClick: () => {
              setGenerationError(null);
            },
          }}
          secondaryAction={{
            label: "Go Back",
            onClick: () => router.back(),
          }}
        />
      </Container>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-var(--text) mb-2">Generation Studio</h1>
        <p className="text-lg text-var(--text-secondary)">
          Create AI-powered content with precision and speed
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Model Selection - Cards */}
          <div>
            <label className="block text-sm font-semibold text-var(--text) mb-3">AI Model</label>
            <div className="space-y-2">
              {models?.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`
                    w-full p-3 rounded-lg border-2 text-left transition-all
                    ${
                      model === m.id
                        ? "border-var(--primary-600) bg-var(--primary-50) dark:bg-var(--primary-950)"
                        : "border-var(--border) bg-var(--surface-1) hover:border-var(--border-strong)"
                    }
                  `}
                >
                  <div className="font-medium text-var(--text)">{m.name}</div>
                  <div className="text-xs text-var(--text-secondary) mt-0.5">{m.provider}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generation Mode - Toggle Cards */}
          <div>
            <label className="block text-sm font-semibold text-var(--text) mb-3">Mode</label>
            <div className="space-y-2">
              <button
                onClick={() => setMode("sync")}
                className={`
                  w-full p-3 rounded-lg border-2 text-left transition-all
                  ${
                    mode === "sync"
                      ? "border-var(--primary-600) bg-var(--primary-50) dark:bg-var(--primary-950)"
                      : "border-var(--border) bg-var(--surface-1) hover:border-var(--border-strong)"
                  }
                `}
              >
                <div className="font-medium text-var(--text)">⚡ Generate Now</div>
                <div className="text-xs text-var(--text-secondary) mt-0.5">Instant results (~30s)</div>
              </button>

              <button
                onClick={() => setMode("async")}
                className={`
                  w-full p-3 rounded-lg border-2 text-left transition-all
                  ${
                    mode === "async"
                      ? "border-var(--primary-600) bg-var(--primary-50) dark:bg-var(--primary-950)"
                      : "border-var(--border) bg-var(--surface-1) hover:border-var(--border-strong)"
                  }
                `}
              >
                <div className="font-medium text-var(--text)">⏱️ Queue & Continue</div>
                <div className="text-xs text-var(--text-secondary) mt-0.5">Background processing</div>
              </button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-var(--primary-50) dark:bg-var(--primary-950) rounded-lg p-4 border border-var(--primary-200) dark:border-var(--primary-900)">
            <h4 className="font-semibold text-var(--primary-900) dark:text-var(--primary-100) text-sm mb-2">💡 Pro Tips</h4>
            <ul className="text-xs text-var(--primary-800) dark:text-var(--primary-200) space-y-1">
              <li>• Use {`{{variable}}`} for dynamic content</li>
              <li>• Be specific in descriptions</li>
              <li>• Longer prompts = better results</li>
            </ul>
          </div>
        </div>

        {/* Right Content - Prompt Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Prompt Editor */}
          <div>
            <label className="block text-sm font-semibold text-var(--text) mb-2">Your Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Example: "Write a brief {{content_type}} about {{topic}} for {{audience}}"\n\nUse {{variable}} syntax to create reusable prompts.`}
              rows={12}
              maxLength={4000}
              showCharCount
              state={generationError ? "error" : undefined}
              helperText={
                generationError
                  ? `Error: ${generationError}`
                  : "Describe what you want to generate"
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={!prompt || !model}
              loading={generate.isPending || generateAsync.isPending}
              size="lg"
              fullWidth
            >
              {mode === "sync" ? "⚡ Generate Now" : "⏱️ Queue & Continue"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setPrompt("")}
              size="lg"
              disabled={!prompt}
            >
              Clear
            </Button>
          </div>

          {/* Model Info Card */}
          {selectedModel && (
            <div className="p-4 rounded-lg bg-var(--surface-2) border border-var(--border)">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-var(--text)">{selectedModel.name}</h4>
                  <p className="text-sm text-var(--text-secondary) mt-1">
                    Powered by {selectedModel.provider}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-var(--text-muted) mb-1">Generation Mode</div>
                  <div className="text-sm font-semibold text-var(--primary-600)">
                    {mode === "sync" ? "Synchronous" : "Asynchronous"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
