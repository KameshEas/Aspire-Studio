"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./ThemeProvider";
import { OrgProvider } from "../lib/org-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <OrgProvider>{children}</OrgProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
