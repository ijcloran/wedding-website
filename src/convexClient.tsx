"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

type ConvexProviderProps = {
  children: ReactNode;
};

export const ConvexAppProvider = ({ children }: ConvexProviderProps) => {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
  const isAbsolute = /^https?:\/\//.test(url);
  if (!isAbsolute) {
    // Convex not configured for this environment; render app without provider
    return <>{children}</>;
  }
  const client = useMemo(() => new ConvexReactClient(url), [url]);
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
};


