"use client";

import React from "react";
import Link from "next/link";
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
} from "../../../components/system";

export default function DashboardPage() {
  const router = useRouter();
  const { activeOrgId } = useActiveOrg();
  const { success, error: showError } = useToast();
  const { isOpen, open, close } = useDialog();

  const { data: orgs, isLoading: orgsLoading } = useOrgs();
  const { data: projects, isLoading } = useProjects(activeOrgId ?? "");
  const createProject = useCreateProject(activeOrgId ?? "");

  // Form state with validation
  const form = useFormState({
    initialValues: {
      name: "",
      slug: "",
      description: "",
    },

    validate: (values) => {
      const errors: Record<string, string> = {};

      // Validate name
      if (!values.name.trim()) {
        errors.name = "Project name is required";
      } else if (values.name.length < 3) {
        errors.name = "Minimum 3 characters";
      } else if (values.name.length > 100) {
        errors.name = "Maximum 100 characters";
      }

      // Validate slug
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

  // Handle name change and auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);

    // Auto-generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    form.setValue("slug", slug);
  };

  // Show loading while checking org
  if (!activeOrgId) {
    if (orgsLoading) {
      return <LoadingState message="Loading organization..." />;
    }
    return <NoOrgState />;
  }

  const activeOrg = orgs?.find((o) => o.id === activeOrgId);

  // Show loading while fetching projects
  if (isLoading) {
    return <LoadingState message="Loading projects..." />;
  }

  // Show empty state if no projects
  if (!projects?.length) {
    return (
      <Container size="xl">
        <SystemEmptyState
          icon={<div className="text-6xl">📦</div>}
          title="No projects yet"
          description="Create your first AI generation project to get started. Projects help organize templates, generations, and artifacts."
          example="Example: Create a project named 'Marketing Content' for managing brand assets"
          action={{
            label: "Create Your First Project",
            onClick: open,
          }}
        />

        {/* Create Dialog */}
        <Dialog open={isOpen} onOpenChange={close}>
          <DialogContent title="Create New Project" closeButton>
            <Form onSubmit={form.handleSubmit} disabled={form.isSubmitting}>
              <Stack spacing="md">
                <FormField
                  label="Project Name"
                  description="A descriptive name for your project"
                  error={form.getError("name")}
                  required
                >
                  <Input
                    {...form.getFieldProps("name")}
                    onChange={handleNameChange}
                    placeholder="e.g., Marketing Content"
                    autoFocus
                  />
                </FormField>

                <FormField
                  label="Project Slug"
                  description="Used in URLs (auto-generated from project name)"
                  error={form.getError("slug")}
                  required
                >
                  <Input
                    {...form.getFieldProps("slug")}
                    placeholder="e.g., marketing-content"
                  />
                </FormField>

                <FormField
                  label="Description"
                  description="What is this project about?"
                >
                  <Textarea
                    {...form.getFieldProps("description")}
                    placeholder="e.g., Managing social media, email, and website content"
                    rows={3}
                  />
                </FormField>

                <Flex gap="sm" justify="end" className="mt-4">
                  <Button
                    variant="secondary"
                    onClick={close}
                    type="button"
                  >
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
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack spacing="lg">
        {/* Header */}
        <Flex direction="row" justify="between" align="center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {activeOrg?.name ?? "Dashboard"}
            </h1>
            <p className="text-gray-600 mt-2">
              {projects.length} project{projects.length !== 1 ? "s" : ""} · Ready to generate
            </p>
          </div>
          <Button onClick={open} size="lg">
            ✨ New Project
          </Button>
        </Flex>

        {/* Projects Grid */}
        <Grid columns={3} gap="lg" responsive>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Grid>

        {/* Create Dialog */}
        <Dialog open={isOpen} onOpenChange={close}>
          <DialogContent title="Create New Project" closeButton>
            <Form onSubmit={form.handleSubmit} disabled={form.isSubmitting}>
              <Stack spacing="md">
                <FormField
                  label="Project Name"
                  description="A descriptive name for your project"
                  error={form.getError("name")}
                  required
                >
                  <Input
                    {...form.getFieldProps("name")}
                    onChange={handleNameChange}
                    placeholder="e.g., Marketing Content"
                    autoFocus
                  />
                </FormField>

                <FormField
                  label="Project Slug"
                  description="Used in URLs (auto-generated from project name)"
                  error={form.getError("slug")}
                  required
                >
                  <Input
                    {...form.getFieldProps("slug")}
                    placeholder="e.g., marketing-content"
                  />
                </FormField>

                <FormField
                  label="Description"
                  description="What is this project about?"
                >
                  <Textarea
                    {...form.getFieldProps("description")}
                    placeholder="e.g., Managing social media, email, and website content"
                    rows={3}
                  />
                </FormField>

                <Flex gap="sm" justify="end" className="mt-4">
                  <Button
                    variant="secondary"
                    onClick={close}
                    type="button"
                  >
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
      </Stack>
    </Container>
  );
}

interface Project {
  id: string;
  name: string;
  description?: string;
  generationCount: number;
  assetCount: number;
}

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/projects/${project.id}`)}
      className="
        border border-gray-200 rounded-lg p-6
        hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50/30
        transition-all duration-200
        text-left
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        group
      "
    >
      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-700 transition-colors">
        {project.name}
      </h3>

      {project.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {project.description}
        </p>
      )}

      <Flex gap="lg" className="text-xs text-gray-500 mt-4">
        <span>⚡ {project.generationCount} generations</span>
        <span>📦 {project.assetCount} artifacts</span>
      </Flex>

      <div className="mt-4 text-sm text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Open Project →
      </div>
    </button>
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
          onClick: () => window.location.href = "/onboarding",
        }}
      />
    </Container>
  );
}
