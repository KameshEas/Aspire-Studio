"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Container, Stack, Grid } from "../../../../../components/system";

export default function SettingsIndex() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const settings = [
    {
      id: "members",
      title: "Members",
      description: "Invite team members and manage roles",
      icon: "👥",
      href: `/projects/${projectId}/settings/members`,
    },
    {
      id: "api-keys",
      title: "API Keys",
      description: "Create and manage project API keys",
      icon: "🔑",
      href: `/projects/${projectId}/settings/api-keys`,
    },
  ];

  return (
    <Container size="xl">
      <Stack spacing="lg">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Settings</h1>
          <p className="text-gray-600 mt-2">Configure project settings and integrations</p>
        </div>

        <Grid columns={2} gap="lg" responsive>
          {settings.map((setting) => (
            <button
              key={setting.id}
              onClick={() => (window.location.href = setting.href)}
              className="
                text-left p-6 border border-gray-200 rounded-lg
                hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-lg
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                group
              "
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{setting.icon}</div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {setting.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                </div>
                <span className="text-xl text-gray-400 ml-4 group-hover:text-indigo-600 transition-colors flex-shrink-0">
                  →
                </span>
              </div>
            </button>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
