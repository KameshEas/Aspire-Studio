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
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);

  // Keep the API client token in sync with Clerk
  useEffect(() => {
    // Register a live getter so every request gets a fresh token
    api.setTokenGetter(getToken);

    let mounted = true;
    const sync = async () => {
      const token = await getToken();
      if (mounted) api.setToken(token);
    };
    sync();
    const id = setInterval(sync, 50_000); // refresh before expiry
    return () => { mounted = false; clearInterval(id); };
  }, [getToken]);

  // Keep org header in sync
  useEffect(() => {
    api.setOrgId(activeOrgId);
  }, [activeOrgId]);

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("aspire_active_org");
    if (saved) setActiveOrgId(saved);
  }, []);

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
