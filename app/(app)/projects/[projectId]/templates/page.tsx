"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useActiveOrg } from "../../../../../lib/org-context";
import { useTemplates, useCreateTemplate, useDeleteTemplate } from "../../../../../lib/hooks";
import { useFormState } from "../../../../../lib/hooks/useFormState";
import { useToast } from "../../../../../lib/hooks/useToast";

import {
  Container,
  Flex,
  Stack,
  Form,
  FormField,
  Input,
  Textarea,
  Button,
  Dialog,
  DialogContent,
  useDialog,
  LoadingState,
  EmptyState,
} from "../../../../../components/system";

export default function TemplatesPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const { activeOrgId } = useActiveOrg();
  const { success, error: showError } = useToast();

  const orgId = activeOrgId ?? "";
  const projectId = params.projectId;

  const { data: templates, isLoading } = useTemplates(orgId, projectId);
  const createTemplate = useCreateTemplate(orgId, projectId);
  const deleteTemplate = useDeleteTemplate(orgId, projectId);

  const { isOpen: createOpen, open: openCreate, close: closeCreate } = useDialog();
  const { isOpen: deleteOpen, open: openDelete, close: closeDelete } = useDialog();

  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);

  // Create template form
  const createForm = useFormState({
    initialValues: {
      name: "",
      description: "",
      prompt: "",
    },

    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.name.trim()) {
        errors.name = "Template name is required";
      } else if (values.name.length < 3) {
        errors.name = "Minimum 3 characters";
      }

      if (!values.prompt.trim()) {
        errors.prompt = "Prompt is required";
      } else if (values.prompt.length < 10) {
        errors.prompt = "Prompt should be at least 10 characters";
      }

      return errors;
    },

    onSubmit: async (values) => {
      try {
        const result = await createTemplate.mutateAsync({
          name: values.name.trim(),
          description: values.description.trim() || undefined,
          prompt: values.prompt.trim(),
        });

        success({
          title: "Template created!",
          description: `${values.name} is ready to use`,
          action: {
            label: "Edit Template",
            onClick: () => router.push(`/projects/${projectId}/templates/${result.id}`),
          },
        });

        closeCreate();
        createForm.resetForm();
      } catch (err) {
        showError({
          title: "Failed to create template",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
  });

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteTemplate.mutateAsync(deleteTargetId);

      success({
        title: "Template deleted",
        description: "The template has been removed",
      });

      closeDelete();
      setDeleteTargetId(null);
    } catch (err) {
      showError({
        title: "Failed to delete template",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingState message="Loading templates..." />;
  }

  // Show empty state
  if (!templates?.length) {
    return (
      <Container size="xl">
        <EmptyState
          icon={<div className="text-6xl">📝</div>}
          title="No templates yet"
          description="Prompt templates are reusable prompts with variable slots like {{product}} and {{audience}}. Perfect for consistent, repeatable generation."
          example='Example: "Write a social media post for {{product}} targeting {{audience}}"'
          action={{
            label: "Create Your First Template",
            onClick: openCreate,
          }}
        />

        {/* Create Dialog */}
        <Dialog open={createOpen} onOpenChange={closeCreate}>
          <DialogContent title="Create Prompt Template" closeButton>
            <Form onSubmit={createForm.handleSubmit} disabled={createForm.isSubmitting}>
              <Stack spacing="md">
                <FormField
                  label="Template Name"
                  description="A clear name for this template"
                  error={createForm.getError("name")}
                  required
                >
                  <Input
                    {...createForm.getFieldProps("name")}
                    placeholder="e.g., Product Description"
                    autoFocus
                  />
                </FormField>

                <FormField
                  label="Description"
                  description="What is this template for?"
                >
                  <Input
                    {...createForm.getFieldProps("description")}
                    placeholder="e.g., E-commerce product pages"
                  />
                </FormField>

                <FormField
                  label="Prompt"
                  description='Use {{"{variable}"}} to create dynamic slots that can be filled in later'
                  error={createForm.getError("prompt")}
                  required
                >
                  <Textarea
                    {...createForm.getFieldProps("prompt")}
                    placeholder={`Example: "Write a compelling product description for {{product_name}} that appeals to {{target_audience}}."`}
                    rows={6}
                    maxLength={2000}
                    showCharCount
                  />
                </FormField>

                <Flex gap="sm" justify="end" className="mt-4">
                  <Button
                    variant="secondary"
                    onClick={closeCreate}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={createForm.isSubmitting}
                    disabled={!createForm.isValid}
                  >
                    Create Template
                  </Button>
                </Flex>
              </Stack>
            </Form>
          </DialogContent>
        </Dialog>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack spacing="lg">
        {/* Header */}
        <Flex direction="row" justify="between" align="center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prompt Templates</h1>
            <p className="text-gray-600 mt-2">
              {templates.length} template{templates.length !== 1 ? "s" : ""} · Reusable prompts with variable slots
            </p>
          </div>
          <Button onClick={openCreate} size="lg">
            ✨ New Template
          </Button>
        </Flex>

        {/* Templates List */}
        <div className="space-y-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onOpen={() => router.push(`/projects/${projectId}/templates/${template.id}`)}
              onDelete={() => {
                setDeleteTargetId(template.id);
                openDelete();
              }}
            />
          ))}
        </div>

        {/* Create Dialog */}
        <Dialog open={createOpen} onOpenChange={closeCreate}>
          <DialogContent title="Create Prompt Template" closeButton>
            <Form onSubmit={createForm.handleSubmit} disabled={createForm.isSubmitting}>
              <Stack spacing="md">
                <FormField
                  label="Template Name"
                  description="A clear name for this template"
                  error={createForm.getError("name")}
                  required
                >
                  <Input
                    {...createForm.getFieldProps("name")}
                    placeholder="e.g., Product Description"
                    autoFocus
                  />
                </FormField>

                <FormField
                  label="Description"
                  description="What is this template for?"
                >
                  <Input
                    {...createForm.getFieldProps("description")}
                    placeholder="e.g., E-commerce product pages"
                  />
                </FormField>

                <FormField
                  label="Prompt"
                  description='Use {{"{variable}"}} to create dynamic slots that can be filled in later'
                  error={createForm.getError("prompt")}
                  required
                >
                  <Textarea
                    {...createForm.getFieldProps("prompt")}
                    placeholder={`Example: "Write a compelling product description for {{product_name}} that appeals to {{target_audience}}."`}
                    rows={6}
                    maxLength={2000}
                    showCharCount
                  />
                </FormField>

                <Flex gap="sm" justify="end" className="mt-4">
                  <Button
                    variant="secondary"
                    onClick={closeCreate}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={createForm.isSubmitting}
                    disabled={!createForm.isValid}
                  >
                    Create Template
                  </Button>
                </Flex>
              </Stack>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteOpen} onOpenChange={closeDelete}>
          <DialogContent title="Delete Template?" closeButton>
            <Stack spacing="md">
              <p className="text-gray-700">
                This will permanently delete the template and all its versions. This action cannot be undone.
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
                  onClick={handleDelete}
                  loading={deleteTemplate.isPending}
                >
                  Delete Template
                </Button>
              </Flex>
            </Stack>
          </DialogContent>
        </Dialog>
      </Stack>
    </Container>
  );
}

interface Template {
  id: string;
  name: string;
  description?: string;
  versionCount: number;
  updatedAt: string;
  createdBy?: { name?: string; email: string };
}

interface TemplateCardProps {
  template: Template;
  onOpen: () => void;
  onDelete: () => void;
}

function TemplateCard({ template, onOpen, onDelete }: TemplateCardProps) {
  return (
    <button
      onClick={onOpen}
      className="
        w-full text-left border border-gray-200 rounded-lg p-4
        hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-md
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        group
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-700 transition-colors">
            {template.name}
          </h3>

          {template.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {template.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
            <span>📋 {template.versionCount} version{template.versionCount !== 1 ? "s" : ""}</span>
            <span>📅 {new Date(template.updatedAt).toLocaleDateString()}</span>
            {template.createdBy && (
              <span>👤 by {template.createdBy.name || template.createdBy.email}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </button>
  );
}
