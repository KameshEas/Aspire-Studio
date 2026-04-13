"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "./api";

interface OrgContextType {
  activeOrgId: string | null;
  setActiveOrgId: (id: string | null) => void;
}

const OrgContext = createContext<OrgContextType>({
  activeOrgId: null,
  setActiveOrgId: () => {},
});

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [activeOrgId, setActiveOrgId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aspire_active_org") ?? null;
    }
    return null;
  });

  // Keep the API client token in sync with Clerk
  useEffect(() => {
    api.setTokenGetter(getToken);

    const controller = new AbortController();
    const sync = async () => {
      try {
        const token = await getToken();
        if (!controller.signal.aborted) api.setToken(token);
      } catch {
        // ignore token refresh errors
      }
    };
    sync();
    const id = setInterval(sync, 50_000);
    return () => { controller.abort(); clearInterval(id); };
  }, [getToken]);

  // Keep org header in sync
  useEffect(() => {
    api.setOrgId(activeOrgId);
  }, [activeOrgId]);

  const updateOrg = (id: string | null) => {
    setActiveOrgId(id);
    if (id) localStorage.setItem("aspire_active_org", id);
    else localStorage.removeItem("aspire_active_org");
  };

  return (
    <OrgContext.Provider value={{ activeOrgId, setActiveOrgId: updateOrg }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useActiveOrg() {
  return useContext(OrgContext);
}
