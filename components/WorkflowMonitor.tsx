"use client";

import { useEffect, useState } from "react";
import { WorkflowExecution } from "@/lib/api";
import { Spinner } from "./Spinner";
import { Card } from "./Card";
import { Stack } from "./Stack";
import { Text } from "./Text";

export interface WorkflowMonitorProps {
  executionId: string | null;
  onComplete?: (execution: WorkflowExecution) => void;
  onError?: (error: string) => void;
}

const statusColors: Record<string, string> = {
  pending: "#FFA500", // Orange
  running: "#4ECDC4", // Teal
  completed: "#95E1D3", // Green
  failed: "#FF6B6B", // Red
};

const statusMessages: Record<string, string> = {
  pending: "Workflow pending...",
  running: "Workflow running...",
  completed: "Workflow completed",
  failed: "Workflow failed",
};

/**
 * WorkflowMonitor Component
 * Real-time display of workflow execution status
 * Shows progress, agent execution order, costs, and results
 */
export function WorkflowMonitor({ executionId, onComplete, onError }: WorkflowMonitorProps) {
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!executionId) return;

    let pollInterval: NodeJS.Timeout;
    let isMounted = true;

    const poll = async () => {
      try {
        const response = await fetch(
          `/api/v1/workflows?executionId=${encodeURIComponent(executionId)}`
        );

        if (!response.ok) throw new Error("Failed to fetch status");

        const data: WorkflowExecution = await response.json();
        if (isMounted) {
          setExecution(data);
          setError(null);

          // Stop polling on completion
          if (data.status === "completed") {
            setIsPolling(false);
            onComplete?.(data);
          } else if (data.status === "failed") {
            setIsPolling(false);
            const errorMsg = data.error || "Workflow failed";
            setError(errorMsg);
            onError?.(errorMsg);
          } else {
            setIsPolling(true);
          }
        }
      } catch (err) {
        if (isMounted) {
          const errorMsg = err instanceof Error ? err.message : "Polling error";
          setError(errorMsg);
          onError?.(errorMsg);
          setIsPolling(false);
        }
      }
    };

    // Initial poll
    poll();

    // Set up interval for subsequent polls
    pollInterval = setInterval(() => {
      if (execution?.status !== "completed" && execution?.status !== "failed") {
        poll();
      }
    }, 2000); // Poll every 2 seconds

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [executionId, onComplete, onError, execution?.status]);

  if (!executionId) {
    return null;
  }

  if (!execution && !error) {
    return (
      <Card>
        <Stack gap="md" align="center">
          <Spinner />
          <Text size="sm" color="#666">
            Loading workflow status...
          </Text>
        </Stack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={{ borderLeft: `4px solid ${statusColors.failed}` }}>
        <Stack gap="sm">
          <Text weight="bold" color={statusColors.failed}>
            Error
          </Text>
          <Text size="sm">{error}</Text>
          <Text size="xs" color="#999">
            Execution ID: {executionId}
          </Text>
        </Stack>
      </Card>
    );
  }

  const status = execution?.status || "pending";
  const statusColor = statusColors[status];

  return (
    <Card style={{ borderLeft: `4px solid ${statusColor}` }}>
      <Stack gap="md">
        {/* Header */}
        <Stack gap="xs">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: statusColor,
                animation: status === "running" ? "pulse 1s infinite" : "none",
              }}
            />
            <Text weight="bold">{statusMessages[status]}</Text>
          </div>
          <Text size="xs" color="#999">
            ID: {executionId}
          </Text>
        </Stack>

        {/* Execution Order */}
        {execution?.result?.executionOrder && execution.result.executionOrder.length > 0 && (
          <div>
            <Text size="sm" weight="bold" color="#333">
              Execution Order
            </Text>
            <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
              {execution.result.executionOrder.map((agent, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#F0F0F0",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {idx + 1}. {agent}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Execution Timing */}
        {execution?.durationMs && (
          <div>
            <Text size="sm" color="#666">
              Duration: <strong>{(execution.durationMs / 1000).toFixed(2)}s</strong>
            </Text>
          </div>
        )}

        {/* Cost Tracking */}
        {execution?.result?.aggregatedCost && (
          <div style={{ backgroundColor: "#F9F9F9", padding: "8px", borderRadius: "4px" }}>
            <Text size="sm" weight="bold">
              Resource Usage
            </Text>
            <Stack gap="xs" style={{ marginTop: "8px" }}>
              <Text size="xs">
                Tokens Used: <strong>{execution.result.aggregatedCost.totalTokensUsed}</strong>
              </Text>
              <Text size="xs">
                Avg per Invocation:{" "}
                <strong>{execution.result.aggregatedCost.averageTokensPerInvocation}</strong>
              </Text>
              {execution.result.aggregatedCost.estimatedCostUSD && (
                <Text size="xs">
                  Estimated Cost: <strong>${execution.result.aggregatedCost.estimatedCostUSD.toFixed(4)}</strong>
                </Text>
              )}
            </Stack>
          </div>
        )}

        {/* Results */}
        {execution?.result?.results && Object.keys(execution.result.results).length > 0 && (
          <div>
            <Text size="sm" weight="bold">
              Results
            </Text>
            <div style={{ marginTop: "8px", fontSize: "12px", maxHeight: "200px", overflow: "auto" }}>
              <pre style={{ margin: 0, backgroundColor: "#F5F5F5", padding: "8px", borderRadius: "4px" }}>
                {JSON.stringify(execution.result.results, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Error Details */}
        {execution?.result?.error && (
          <div style={{ backgroundColor: "#FFF0F0", padding: "8px", borderRadius: "4px" }}>
            <Text size="sm" color={statusColors.failed} weight="bold">
              Workflow Error
            </Text>
            <Text size="xs" style={{ marginTop: "4px" }}>
              {execution.result.error}
            </Text>
          </div>
        )}
      </Stack>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </Card>
  );
}
