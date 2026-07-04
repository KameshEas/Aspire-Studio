"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useModels, useGenerate, useGenerateAsync } from "../../../../../lib/hooks";
import { useToast } from "../../../../../lib/hooks/useToast";

import {
  Container,
  Stack,
  Flex,
  FormField,
  Select,
  Textarea,
  Button,
  RadioGroup,
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
    <Container size="lg">
      <Stack spacing="lg">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate Studio</h1>
          <p className="text-gray-600 mt-2">
            Create AI-generated content using templates or custom prompts.
          </p>
        </div>

        {/* Model Selection */}
        <FormField
          label="AI Model"
          description="Choose which AI model to use for generation"
          required
        >
          <Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            options={
              models?.map((m) => ({
                label: `${m.name} - ${m.provider}`,
                value: m.id,
              })) ?? []
            }
          />
        </FormField>

        {/* Mode Selection */}
        <FormField
          label="Generation Mode"
          description="Choose how to run this generation"
        >
          <RadioGroup
            value={mode}
            onChange={(v) => setMode(v as "sync" | "async")}
            options={[
              {
                value: "sync",
                label: "⚡ Generate Now",
                description: "Wait for result immediately (~30 seconds). Perfect for testing and quick iterations.",
              },
              {
                value: "async",
                label: "⏱️ Queue & Continue",
                description: "Process in background. Perfect for batch jobs. Check results later in History.",
              },
            ]}
          />
        </FormField>

        {/* Prompt Input */}
        <FormField
          label="Prompt"
          description='Describe what you want to generate. Use {{"{variable}"}} for dynamic parts.'
          required
        >
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Example: "Write a {{type}} for {{audience}}" or "Generate {{count}} ideas for {{topic}}"`}
            rows={12}
            maxLength={4000}
            showCharCount
          />
        </FormField>

        {/* Action Buttons */}
        <Flex gap="md">
          <Button
            onClick={handleGenerate}
            disabled={!prompt || !model}
            loading={generate.isPending || generateAsync.isPending}
            size="lg"
          >
            {mode === "sync" ? "⚡ Generate Now" : "⏱️ Queue"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setPrompt("");
            }}
            size="lg"
          >
            Clear
          </Button>
        </Flex>

        {/* Tips Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-blue-900">💡 Tips for Better Results</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Use {{"{variable_name}"}} to make your prompt dynamic and reusable</li>
            <li>✓ Be specific and clear about what you want generated</li>
            <li>✓ Longer, detailed prompts usually produce better results</li>
            <li>✓ Use "Generate Now" for testing, "Queue" for batch jobs</li>
            <li>✓ Check History to see all your generations and their costs</li>
          </ul>
        </div>

        {/* Model Info */}
        {selectedModel && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">About {selectedModel.name}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Provider:</span> {selectedModel.provider}
              </p>
              {selectedModel.costPer1kTokens && (
                <p>
                  <span className="font-medium">Cost:</span> ${selectedModel.costPer1kTokens}/1k tokens
                </p>
              )}
              {selectedModel.maxTokens && (
                <p>
                  <span className="font-medium">Max tokens:</span> {selectedModel.maxTokens.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </Stack>
    </Container>
  );
}
