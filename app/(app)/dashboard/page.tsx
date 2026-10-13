"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useProjects, useCreateProject } from "../../../lib/hooks";
import { useOrgs } from "../../../lib/hooks";
import { useActiveOrg } from "../../../lib/org-context";
import { useFormState } from "../../../lib/hooks/useFormState";
import { useToast } from "../../../lib/hooks/useToast";

import {
  Container,
  Flex,
  Grid,
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
  EmptyState as SystemEmptyState,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "../../../components/system";

export default function DashboardPage() {
  const router = useRouter();
  const { activeOrgId } = useActiveOrg();
  const { success, error: showError } = useToast();
  const { isOpen, open, close } = useDialog();

  const { data: orgs, isLoading: orgsLoading } = useOrgs();
  const { data: projects, isLoading } = useProjects(activeOrgId ?? "");
  const createProject = useCreateProject(activeOrgId ?? "");

  const form = useFormState({
    initialValues: {
      name: "",
      slug: "",
      description: "",
    },

    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.name.trim()) {
        errors.name = "Project name is required";
      } else if (values.name.length < 3) {
        errors.name = "Minimum 3 characters";
      } else if (values.name.length > 100) {
        errors.name = "Maximum 100 characters";
      }

      if (!values.slug.trim()) {
        errors.slug = "Slug is required";
      } else if (!/^[a-z0-9-]+$/.test(values.slug)) {
        errors.slug = "Only lowercase letters, numbers, and dashes";
      } else if (values.slug.startsWith("-") || values.slug.endsWith("-")) {
        errors.slug = "Cannot start or end with a dash";
      }

      return errors;
    },

    onSubmit: async (values) => {
      try {
        await createProject.mutateAsync({
          name: values.name,
          slug: values.slug,
          description: values.description || undefined,
        });

        success({
          title: "Project created!",
          description: `${values.name} is ready to use`,
          action: {
            label: "Open Project",
            onClick: () => router.push(`/projects/${values.slug}`),
          },
        });

        close();
        form.resetForm();
      } catch (err) {
        showError({
          title: "Failed to create project",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    form.setValue("slug", slug);
  };

  if (!activeOrgId) {
    if (orgsLoading) {
      return <LoadingState message="Loading organization..." />;
    }
    return <NoOrgState />;
  }

  const activeOrg = orgs?.find((o) => o.id === activeOrgId);

  if (isLoading) {
    return <LoadingState message="Loading projects..." />;
  }

  if (!projects?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] px-4">
        {/* Empty State */}
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold text-[color:var(--text)] mb-3">No projects yet</h2>
          <p className="text-[color:var(--text-secondary)] mb-8 text-lg">
            Create your first AI generation project to start building intelligent features instantly.
          </p>
          <Button onClick={open} size="lg" fullWidth>
            Create Your First Project
          </Button>
        </div>

        {/* Dialog */}
        <Dialog open={isOpen} onOpenChange={close}>
          <DialogContent title="Create New Project" closeButton>
            <Form onSubmit={form.handleSubmit} disabled={form.isSubmitting}>
              <Stack spacing="md">
                <FormField label="Project Name" required>
                  <Input
                    value={form.values.name}
                    onChange={handleNameChange}
                    placeholder="e.g., Marketing Content"
                    autoFocus
                    error={form.getError("name")}
                  />
                </FormField>

                <FormField label="Project Slug" required>
                  <Input
                    value={form.values.slug}
                    onChange={(e) => form.setValue("slug", e.target.value)}
                    placeholder="e.g., marketing-content"
                    error={form.getError("slug")}
                  />
                </FormField>

                <FormField label="Description">
                  <Textarea
                    value={form.values.description}
                    onChange={(e) => form.setValue("description", e.target.value)}
                    placeholder="What is this project about?"
                    rows={3}
                  />
                </FormField>

                <Flex gap="md" justify="end" className="mt-6">
                  <Button variant="outline" onClick={close} type="button">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={form.isSubmitting}
                    disabled={!form.isValid}
                  >
                    Create Project
                  </Button>
                </Flex>
              </Stack>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const totalGenerations = projects.reduce((sum, p) => sum + (p.generationCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        {/* Title */}
        <div>
          <h1 className="text-4xl font-bold text-[color:var(--text)] mb-2">{activeOrg?.name ?? "Dashboard"}</h1>
          <p className="text-[color:var(--text-secondary)]">
            Manage your AI generation projects and templates
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--text-secondary)]">Total Projects</p>
                <p className="text-2xl font-bold text-[color:var(--text)] mt-1">{projects.length}</p>
              </div>
              <div className="text-4xl opacity-20">📦</div>
            </div>
          </Card>

          <Card variant="elevated" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--text-secondary)]">Generations</p>
                <p className="text-2xl font-bold text-[color:var(--text)] mt-1">{totalGenerations}</p>
              </div>
              <div className="text-4xl opacity-20">⚡</div>
            </div>
          </Card>

          <Card variant="elevated" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--text-secondary)]">Quick Action</p>
                <Button onClick={open} size="sm" className="mt-2">
                  + New Project
                </Button>
              </div>
              <div className="text-4xl opacity-20">🎯</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent title="Create New Project" closeButton>
          <Form onSubmit={form.handleSubmit} disabled={form.isSubmitting}>
            <Stack spacing="md">
              <FormField label="Project Name" required>
                <Input
                  value={form.values.name}
                  onChange={handleNameChange}
                  placeholder="e.g., Marketing Content"
                  autoFocus
                  error={form.getError("name")}
                />
              </FormField>

              <FormField label="Project Slug" required>
                <Input
                  value={form.values.slug}
                  onChange={(e) => form.setValue("slug", e.target.value)}
                  placeholder="e.g., marketing-content"
                  error={form.getError("slug")}
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  value={form.values.description}
                  onChange={(e) => form.setValue("description", e.target.value)}
                  placeholder="What is this project about?"
                  rows={3}
                />
              </FormField>

              <Flex gap="md" justify="end" className="mt-6">
                <Button variant="outline" onClick={close} type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={form.isSubmitting}
                  disabled={!form.isValid}
                >
                  Create Project
                </Button>
              </Flex>
            </Stack>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface Project {
  id: string;
  name: string;
  description?: string | null;
  generationCount?: number;
  assetCount?: number;
}

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  return (
    <Card
      variant="elevated"
      padding="lg"
      clickable
      onClick={() => router.push(`/projects/${project.id}`)}
      className="group h-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[color:var(--text)] group-hover:text-[color:var(--primary-600)] transition-colors line-clamp-2">
          {project.name}
        </h3>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-[color:var(--text-secondary)] mb-4 line-clamp-2 flex-grow">
          {project.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex flex-wrap gap-2 mb-6 pt-4 border-t border-[color:var(--border)]">
        <Badge variant="primary" size="sm">
          <span>⚡</span>
          <span>{project.generationCount} {project.generationCount === 1 ? "Generation" : "Generations"}</span>
        </Badge>
        <Badge variant="default" size="sm">
          <span>📦</span>
          <span>{project.assetCount} {project.assetCount === 1 ? "Artifact" : "Artifacts"}</span>
        </Badge>
      </div>

      {/* CTA */}
      <div className="flex items-center text-sm font-medium text-[color:var(--primary-600)] opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Open Project</span>
        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Card>
  );
}

function NoOrgState() {
  return (
    <Container size="lg">
      <SystemEmptyState
        icon={<div className="text-6xl">🎯</div>}
        title="Welcome to Aspire Studio"
        description="Create or join an organization to start generating AI-powered content."
        example="Organizations help you manage teams, projects, and billing"
        action={{
          label: "Get Started",
          onClick: () => (window.location.href = "/onboarding"),
        }}
      />
    </Container>
  );
}
