"use client";

import { useState, useEffect } from "react";
import { WorkflowExecutionRequest } from "@/lib/api";
import { Card } from "./Card";
import { Stack } from "./Stack";
import { Text } from "./Text";
import { Select } from "./Select";
import { TextInput } from "./TextInput";
import { Button } from "./Button";
import { Heading } from "./Heading";

export interface WorkflowCreatorProps {
  agents: string[];
  onExecute: (request: WorkflowExecutionRequest) => Promise<void>;
  loading?: boolean;
}

type TaskType = "brand" | "ui" | "content" | "code" | "seo" | "deployment" | "multi-step";

const agentDescriptions: Record<string, string> = {
  brand: "Generate brand identity (name, colors, logo, guide)",
  ui: "Generate UI/UX layouts and HTML/CSS code",
  content: "Generate marketing copy and SEO metadata",
  code: "Generate React components and tests",
  seo: "Analyze SEO strategy and competitors",
  deployment: "Deploy to GitHub, Vercel, DNS setup",
};

const taskTypes: TaskType[] = ["brand", "ui", "content", "code", "seo", "deployment", "multi-step"];

/**
 * WorkflowCreator Component
 * Form to create and execute workflows
 * Allows single-task or multi-step workflow configuration
 */
export function WorkflowCreator({ agents, onExecute, loading = false }: WorkflowCreatorProps) {
  const [taskType, setTaskType] = useState<TaskType>("brand");
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // Determine if multi-step mode
  const isMultiStep = taskType === "multi-step";

  // Collect available agents based on selection
  useEffect(() => {
    if (!isMultiStep && selectedDependencies.includes(taskType)) {
      setSelectedDependencies((prev) => prev.filter((dep) => dep !== taskType));
    }
  }, [taskType, isMultiStep, selectedDependencies]);

  // Get input schema for current task type
  const getInputFields = (type: TaskType): Record<string, { label: string; placeholder: string }> => {
    const schemas: Record<TaskType, Record<string, { label: string; placeholder: string }>> = {
      brand: {
        industry: { label: "Industry", placeholder: "e.g., SaaS, E-commerce" },
        targetAudience: { label: "Target Audience", placeholder: "e.g., Startups, Enterprise" },
        tone: { label: "Brand Tone", placeholder: "e.g., professional, playful" },
        keywords: { label: "Keywords (comma-separated)", placeholder: "e.g., AI, automation" },
      },
      ui: {
        pageType: { label: "Page Type", placeholder: "e.g., landing, dashboard" },
        components: { label: "Components (comma-separated)", placeholder: "e.g., navbar, hero, cards" },
        colorScheme: { label: "Color Scheme (JSON)", placeholder: '{"primary":"#FF6B6B","secondary":"#4ECDC4"}' },
      },
      content: {
        productName: { label: "Product Name", placeholder: "e.g., TechFlow" },
        productDescription: { label: "Product Description", placeholder: "Describe your product" },
        targetAudience: { label: "Target Audience", placeholder: "e.g., Developers" },
        tone: { label: "Content Tone", placeholder: "e.g., professional, casual" },
      },
      code: {
        componentName: { label: "Component Name", placeholder: "e.g., UserCard" },
        functionality: { label: "Functionality", placeholder: "Describe what the component does" },
        props: { label: "Props (JSON)", placeholder: '[{"name":"userId","type":"string"}]' },
      },
      seo: {
        targetKeywords: { label: "Target Keywords (comma-separated)", placeholder: "e.g., React, hooks" },
        contentTopic: { label: "Content Topic", placeholder: "e.g., React Best Practices" },
        competitorUrls: { label: "Competitor URLs (comma-separated, optional)", placeholder: "" },
      },
      deployment: {
        projectName: { label: "Project Name", placeholder: "e.g., my-app" },
        environment: { label: "Environment", placeholder: "staging or production" },
        repositoryUrl: { label: "Repository URL (optional)", placeholder: "https://github.com/..." },
        customDomain: { label: "Custom Domain (optional)", placeholder: "e.g., myapp.com" },
      },
      "multi-step": {
        note: { label: "Note", placeholder: "Multi-step workflows execute all selected agents in order" },
      },
    };
    return schemas[type] || {};
  };

  const handleInputChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleDependencyToggle = (agent: string) => {
    setSelectedDependencies((prev) =>
      prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent]
    );
  };

  const validateInputs = (): boolean => {
    const requiredFields = isMultiStep ? [] : Object.keys(getInputFields(taskType));
    for (const field of requiredFields) {
      if (!inputs[field]?.trim()) {
        setError(`${field} is required`);
        return false;
      }
    }
    if (isMultiStep && selectedDependencies.length === 0) {
      setError("Select at least one agent for multi-step workflow");
      return false;
    }
    setError(null);
    return true;
  };

  const parseJsonField = (value: string, fieldName: string) => {
    if (!value.trim()) return undefined;
    try {
      return JSON.parse(value);
    } catch (e) {
      setError(`Invalid JSON in ${fieldName}`);
      throw e;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!validateInputs()) return;

      const agentInputs: Record<string, unknown> = {};

      if (isMultiStep) {
        // For multi-step, pass shared inputs
        Object.entries(inputs).forEach(([key, value]) => {
          if (key === "note") return; // Skip placeholder
          if (value.includes("{")) {
            agentInputs[key] = parseJsonField(value, key);
          } else {
            agentInputs[key] = value;
          }
        });
      } else {
        // For single task, parse fields
        const fields = getInputFields(taskType);
        Object.entries(fields).forEach(([key]) => {
          const value = inputs[key];
          if (!value) return;

          if (key === "props" || key === "colorScheme" || key === "competitorUrls") {
            // Parse JSON for these fields
            if (value.startsWith("[") || value.startsWith("{")) {
              agentInputs[key] = parseJsonField(value, key);
            } else if (key === "competitorUrls") {
              agentInputs[key] = value.split(",").map((s) => s.trim());
            }
          } else if (key === "components" || key === "keywords" || key === "targetKeywords") {
            agentInputs[key] = value.split(",").map((s) => s.trim());
          } else {
            agentInputs[key] = value;
          }
        });
      }

      const request: WorkflowExecutionRequest = {
        taskType,
        agentInputs,
        ...(isMultiStep && { dependencies: selectedDependencies as any }),
      };

      await onExecute(request);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid input";
      setError(msg);
    }
  };

  const inputFields = getInputFields(taskType);

  return (
    <Card>
      <Stack gap="lg">
        <Heading level={3}>Create Workflow</Heading>

        {/* Task Type Selection */}
        <div>
          <Text weight="bold" size="sm">
            Task Type
          </Text>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px", marginTop: "8px" }}>
            {taskTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTaskType(type)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: taskType === type ? "2px solid #4ECDC4" : "1px solid #DDD",
                  backgroundColor: taskType === type ? "#F0FFFE" : "#FFF",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: taskType === type ? "bold" : "normal",
                }}
              >
                {type}
              </button>
            ))}
          </div>
          {!isMultiStep && (
            <Text size="xs" color="#666" style={{ marginTop: "4px" }}>
              {agentDescriptions[taskType] || ""}
            </Text>
          )}
        </div>

        {/* Multi-Step Agent Selection */}
        {isMultiStep && agents.length > 0 && (
          <div>
            <Text weight="bold" size="sm">
              Select Agents (execution order)
            </Text>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              {agents.map((agent) => (
                <label key={agent} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedDependencies.includes(agent)}
                    onChange={() => handleDependencyToggle(agent)}
                    style={{ cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "14px" }}>{agent}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Input Fields */}
        {Object.entries(inputFields).length > 0 && (
          <div>
            <Text weight="bold" size="sm">
              Configuration
            </Text>
            <Stack gap="md" style={{ marginTop: "12px" }}>
              {Object.entries(inputFields).map(([key, { label, placeholder }]) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "500", marginBottom: "4px" }}>
                    {label}
                  </label>
                  <textarea
                    value={inputs[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={placeholder}
                    style={{
                      width: "100%",
                      minHeight: key.includes("json") || key === "colorScheme" ? "80px" : "40px",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #DDD",
                      fontFamily: key.includes("json") ? "monospace" : "inherit",
                      fontSize: "13px",
                    }}
                  />
                </div>
              ))}
            </Stack>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ backgroundColor: "#FFF0F0", padding: "8px", borderRadius: "4px" }}>
            <Text size="sm" color="#FF6B6B">
              {error}
            </Text>
          </div>
        )}

        {/* Submit Button */}
        <Button onClick={handleSubmit} disabled={loading} style={{ marginTop: "12px" }}>
          {loading ? "Executing..." : "Execute Workflow"}
        </Button>
      </Stack>
    </Card>
  );
}
