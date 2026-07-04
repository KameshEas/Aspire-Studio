"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useActiveOrg } from "../../../../../../lib/org-context";
import { useProjectApiKeys, useCreateProjectApiKey, useRevokeProjectApiKey } from "../../../../../../lib/hooks";
import { useFormState } from "../../../../../../lib/hooks/useFormState";
import { useToast } from "../../../../../../lib/hooks/useToast";
import {
  Container,
  Stack,
  Flex,
  Button,
  Form,
  FormField,
  Textarea,
  Dialog,
  DialogContent,
  useDialog,
  LoadingState,
  EmptyState,
} from "../../../../../../components/system";

export default function ApiKeysPage() {
  const params = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const { success, error: showError } = useToast();
  const { isOpen: deleteOpen, open: openDelete, close: closeDelete } = useDialog();

  const orgId = activeOrgId ?? "";
  const projectId = params.projectId;

  const { data: keys, isLoading } = useProjectApiKeys(orgId, projectId);
  const createKey = useCreateProjectApiKey(orgId, projectId);
  const revokeKey = useRevokeProjectApiKey(orgId, projectId);

  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);

  const form = useFormState({
    initialValues: { description: "" },
    validate: (v) => ({
      ...(v.description.length === 0 && { description: "Description required" }),
      ...(v.description.length < 3 && v.description.length > 0 && { description: "Min 3 characters" }),
    }),
    onSubmit: async (v) => {
      try {
        const res = await createKey.mutateAsync({ description: v.description, scopes: ["project:read"] });
        setCreatedKey(res.key);
        form.resetForm();
        success({
          title: "API key created",
          description: "Copy the key now — it won't be shown again",
        });
      } catch (err) {
        showError({
          title: "Failed to create API key",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
  });

  const handleRevokeClick = (keyId: string) => {
    setDeleteKeyId(keyId);
    openDelete();
  };

  const handleRevoke = () => {
    if (!deleteKeyId) return;
    revokeKey.mutate(deleteKeyId, {
      onSuccess: () => {
        success({
          title: "API key revoked",
          description: "The key has been disabled",
        });
        closeDelete();
        setDeleteKeyId(null);
      },
      onError: (err) => {
        showError({
          title: "Failed to revoke key",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      },
    });
  };

  const copyKeyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      success({
        title: "Copied!",
        description: "API key copied to clipboard",
      });
    } catch {
      showError({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
      });
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading API keys..." />;
  }

  return (
    <Container size="xl">
      <Stack spacing="lg">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-2">Create and manage project API keys for integrations</p>
        </div>

        {/* Create Key Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Create New API Key</h2>
          <Form onSubmit={form.handleSubmit}>
            <Stack spacing="md">
              <FormField
                label="Key Description"
                description="A name to identify this key's purpose"
                error={form.getError("description")}
                required
              >
                <Textarea
                  placeholder="e.g., Production integration, Backup job, etc."
                  {...form.getFieldProps("description")}
                />
              </FormField>

              <div className="text-sm bg-amber-50 border border-amber-100 rounded-lg p-3">
                <p className="font-medium text-amber-900">⚠️ Security Notice</p>
                <p className="text-amber-800 mt-1">
                  API keys grant access to your project. Store them securely. You won't be able to view the key after creation.
                </p>
              </div>

              <Button
                type="submit"
                loading={createKey.isPending}
                disabled={!form.isValid}
              >
                Create API Key
              </Button>
            </Stack>
          </Form>

          {/* Created Key Display */}
          {createdKey && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900 mb-2">✓ API Key Created</p>
              <p className="text-sm text-green-800 mb-3">Copy this key now — it won't be shown again:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-900 text-gray-100 px-3 py-2 rounded font-mono text-xs overflow-x-auto">
                  {createdKey}
                </code>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copyKeyToClipboard(createdKey)}
                >
                  📋 Copy
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Keys List */}
        {!keys?.length ? (
          <EmptyState
            icon={<div className="text-6xl">🔑</div>}
            title="No API keys yet"
            description="Create your first API key to enable integrations"
            example="Use API keys to authenticate with external services and tools"
            action={{
              label: "Create First Key",
              onClick: () => window.scrollTo(0, 0),
            }}
          />
        ) : (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Active Keys ({keys.length})</h2>
            <div className="space-y-3">
              {keys.map((key) => (
                <ApiKeyCard
                  key={key.id}
                  apiKey={key}
                  onRevoke={() => handleRevokeClick(key.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Revoke Confirmation Dialog */}
        <Dialog open={deleteOpen} onOpenChange={closeDelete}>
          <DialogContent title="Revoke API Key?" closeButton>
            <Stack spacing="md">
              <p className="text-gray-700">
                This will immediately disable the API key. Any services using this key will stop working.
              </p>
              <Flex gap="sm" justify="end">
                <Button
                  variant="secondary"
                  onClick={closeDelete}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRevoke}
                  loading={revokeKey.isPending}
                >
                  Revoke Key
                </Button>
              </Flex>
            </Stack>
          </DialogContent>
        </Dialog>
      </Stack>
    </Container>
  );
}

interface ApiKeyCardProps {
  apiKey: any;
  onRevoke: () => void;
}

function ApiKeyCard({ apiKey, onRevoke }: ApiKeyCardProps) {
  const createdDate = new Date(apiKey.createdAt).toLocaleDateString();
  const scopeLabels: Record<string, string> = {
    "project:read": "Read-only",
    "project:write": "Write access",
    "project:admin": "Admin access",
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{apiKey.description}</h3>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Created {createdDate}</span>
            <span>
              {apiKey.scopes?.map((scope: string) => scopeLabels[scope] || scope).join(", ")}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="danger"
          onClick={onRevoke}
          aria-label={`Revoke ${apiKey.description}`}
        >
          Revoke
        </Button>
      </div>
    </div>
  );
}
