"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useActiveOrg } from "../../../../../../lib/org-context";
import { useProjectMembers, useAddProjectMember } from "../../../../../../lib/hooks";
import { useFormState } from "../../../../../../lib/hooks/useFormState";
import { useToast } from "../../../../../../lib/hooks/useToast";
import {
  Container,
  Stack,
  Flex,
  Button,
  Form,
  FormField,
  Input,
  Select,
  LoadingState,
  EmptyState,
} from "../../../../../../components/system";

const ROLES = [
  { label: "Viewer", value: "viewer" },
  { label: "Developer", value: "developer" },
  { label: "Admin", value: "admin" },
];

export default function MembersPage() {
  const params = useParams<{ projectId: string }>();
  const { activeOrgId } = useActiveOrg();
  const { success, error: showError } = useToast();
  const orgId = activeOrgId ?? "";
  const projectId = params.projectId;

  const { data: members, isLoading } = useProjectMembers(orgId, projectId);
  const addMember = useAddProjectMember(orgId, projectId);

  const form = useFormState({
    initialValues: { emailOrId: "", role: "developer" },
    validate: (v) => ({
      ...(v.emailOrId.length === 0 && { emailOrId: "Email or ID required" }),
      ...(v.emailOrId.length < 3 && v.emailOrId.length > 0 && { emailOrId: "Invalid email or ID" }),
    }),
    onSubmit: async (v) => {
      try {
        await addMember.mutateAsync({ userId: v.emailOrId, role: v.role });
        form.resetForm();
        success({
          title: "Member invited",
          description: `Successfully invited user to the project`,
        });
      } catch (err) {
        showError({
          title: "Failed to invite member",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
  });

  if (isLoading) {
    return <LoadingState message="Loading members..." />;
  }

  if (!members?.length) {
    return (
      <Container size="xl">
        <EmptyState
          icon={<div className="text-6xl">👥</div>}
          title="No members yet"
          description="Invite team members to collaborate on this project"
          example="Add members with viewer, developer, or admin roles to control access"
          action={{
            label: "Invite First Member",
            onClick: () => window.scrollTo(0, 0),
          }}
        />
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack spacing="lg">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Members</h1>
          <p className="text-gray-600 mt-2">
            {members.length} member{members.length !== 1 ? "s" : ""} · Manage team access and permissions
          </p>
        </div>

        {/* Invite Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Invite Member</h2>
          <Form onSubmit={form.handleSubmit}>
            <Stack spacing="md">
              <Flex gap="md">
                <div className="flex-1">
                  <FormField
                    label="Email or User ID"
                    error={form.getError("emailOrId")}
                    required
                  >
                    <Input
                      placeholder="user@example.com or user-id"
                      {...form.getFieldProps("emailOrId")}
                    />
                  </FormField>
                </div>
                <div className="w-40">
                  <FormField label="Role" required>
                    <Select options={ROLES} {...form.getFieldProps("role")} />
                  </FormField>
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    loading={addMember.isPending}
                    disabled={!form.isValid}
                  >
                    Invite
                  </Button>
                </div>
              </Flex>

              <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="font-medium text-blue-900 mb-1">Role permissions:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• <strong>Viewer:</strong> View-only access to projects and artifacts</li>
                  <li>• <strong>Developer:</strong> Full access, can create and modify content</li>
                  <li>• <strong>Admin:</strong> Full access plus team management</li>
                </ul>
              </div>
            </Stack>
          </Form>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Members</h2>
          {members.map((member) => (
            <MemberCard key={member.userId} member={member} />
          ))}
        </div>
      </Stack>
    </Container>
  );
}

interface MemberCardProps {
  member: any;
}

function MemberCard({ member }: MemberCardProps) {
  const roleColors: Record<string, { bg: string; text: string }> = {
    admin: { bg: "bg-red-50", text: "text-red-700" },
    developer: { bg: "bg-blue-50", text: "text-blue-700" },
    viewer: { bg: "bg-gray-100", text: "text-gray-700" },
  };

  const colors = roleColors[member.role] || roleColors.viewer;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{member.name ?? member.email}</h3>
          <p className="text-sm text-gray-600">{member.email}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
            {member.role}
          </span>
        </div>
      </div>
    </div>
  );
}
