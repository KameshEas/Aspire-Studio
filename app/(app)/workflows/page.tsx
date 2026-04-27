"use client";

import { useState, useEffect } from "react";
import { WorkflowCreator } from "@/components/WorkflowCreator";
import { WorkflowMonitor } from "@/components/WorkflowMonitor";
import { Card } from "@/components/Card";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { Heading } from "@/components/Heading";
import { useAvailableAgents, useExecuteWorkflow, useWorkflowsList } from "@/lib/hooks";
import { WorkflowExecution, WorkflowExecutionRequest } from "@/lib/api";

/**
 * Workflows Page
 * Main page for managing workflow executions
 * Features:
 * - Workflow creator form
 * - Real-time execution monitor
 * - Execution history
 */
export default function WorkflowsPage() {
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [completedWorkflows, setCompletedWorkflows] = useState<WorkflowExecution[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { data: agentsData } = useAvailableAgents();
  const { mutate: executeWorkflow, isPending } = useExecuteWorkflow();
  const { data: workflowsList } = useWorkflowsList();

  // Load completed workflows
  useEffect(() => {
    if (workflowsList?.executions) {
      setCompletedWorkflows(
        workflowsList.executions.filter((w) => w.status === "completed" || w.status === "failed")
      );
    }
  }, [workflowsList]);

  const handleExecuteWorkflow = async (request: WorkflowExecutionRequest) => {
    try {
      setError(null);
      executeWorkflow(request, {
        onSuccess: (data) => {
          setExecutingId(data.executionId);
        },
        onError: (err: any) => {
          setError(err.message || "Failed to execute workflow");
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleWorkflowComplete = (execution: WorkflowExecution) => {
    if (execution.status === "completed") {
      // Add to history
      setCompletedWorkflows((prev) => [execution, ...prev]);
    }
  };

  const agents = agentsData?.agents || [];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Heading level={1}>Workflow Orchestration</Heading>
          <Text color="#666" style={{ marginTop: "8px" }}>
            Create and manage multi-agent workflows for autonomous content generation
          </Text>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Left: Creator */}
          <div>
            <WorkflowCreator agents={agents} onExecute={handleExecuteWorkflow} loading={isPending} />
          </div>

          {/* Right: Monitor & History */}
          <div>
            <Stack gap="lg">
              {/* Monitor */}
              {executingId && (
                <div>
                  <Text weight="bold" size="sm" color="#333" style={{ marginBottom: "8px" }}>
                    Current Execution
                  </Text>
                  <WorkflowMonitor
                    executionId={executingId}
                    onComplete={handleWorkflowComplete}
                    onError={(err) => setError(err)}
                  />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Card style={{ borderLeft: "4px solid #FF6B6B", backgroundColor: "#FFF0F0" }}>
                  <Stack gap="xs">
                    <Text weight="bold" color="#FF6B6B">
                      Error
                    </Text>
                    <Text size="sm">{error}</Text>
                  </Stack>
                </Card>
              )}

              {/* History */}
              {completedWorkflows.length > 0 && (
                <div>
                  <Text weight="bold" size="sm" color="#333" style={{ marginBottom: "12px" }}>
                    Execution History ({completedWorkflows.length})
                  </Text>
                  <Stack gap="sm">
                    {completedWorkflows.slice(0, 5).map((workflow) => (
                      <Card key={workflow.id} style={{ opacity: 0.8 }}>
                        <Stack gap="xs">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <Text weight="bold" size="sm">
                                {workflow.input.taskType}
                              </Text>
                              <Text size="xs" color="#666">
                                {workflow.input.dependencies?.join(", ") || "Single task"}
                              </Text>
                            </div>
                            <div
                              style={{
                                padding: "2px 6px",
                                borderRadius: "2px",
                                backgroundColor: workflow.status === "completed" ? "#E8F5E9" : "#FFEBEE",
                              }}
                            >
                              <Text size="xs" color={workflow.status === "completed" ? "#2E7D32" : "#C62828"}>
                                {workflow.status}
                              </Text>
                            </div>
                          </div>
                          <Text size="xs" color="#999">
                            Duration: {workflow.durationMs ? `${(workflow.durationMs / 1000).toFixed(2)}s` : "N/A"}
                          </Text>
                          {workflow.result?.aggregatedCost && (
                            <Text size="xs" color="#666">
                              Tokens: {workflow.result.aggregatedCost.totalTokensUsed}
                            </Text>
                          )}
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                </div>
              )}
            </Stack>
          </div>
        </div>

        {/* Agent Discovery Section */}
        {agents.length > 0 && (
          <Card style={{ backgroundColor: "#F9F9F9" }}>
            <Stack gap="md">
              <Text weight="bold" size="sm">
                Available Agents ({agents.length})
              </Text>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
                {agents.map((agent) => (
                  <div
                    key={agent}
                    style={{
                      padding: "12px",
                      backgroundColor: "#FFF",
                      borderRadius: "6px",
                      border: "1px solid #DDD",
                      textAlign: "center",
                    }}
                  >
                    <Text size="sm" weight="bold">
                      {agent}
                    </Text>
                  </div>
                ))}
              </div>
            </Stack>
          </Card>
        )}

        {/* Documentation Section */}
        <Card style={{ backgroundColor: "#F0FFFE" }}>
          <Stack gap="sm">
            <Text weight="bold" size="sm">
              💡 Quick Start
            </Text>
            <Stack gap="xs">
              <Text size="xs">
                1. Select a task type (Brand, UI, Content, Code, SEO, or Deployment)
              </Text>
              <Text size="xs">
                2. Fill in the required configuration fields
              </Text>
              <Text size="xs">
                3. Click "Execute Workflow" to start
              </Text>
              <Text size="xs">
                4. Monitor real-time progress on the right panel
              </Text>
              <Text size="xs">
                5. View execution history and results below
              </Text>
            </Stack>
            <Text size="xs" color="#666" style={{ marginTop: "8px" }}>
              For multi-step workflows, select "multi-step" and check multiple agents
            </Text>
          </Stack>
        </Card>
      </Stack>
    </div>
  );
}
