/**
 * Jobber connection status widget — used on the dashboard.
 * Shows a "Connect Jobber" banner when not connected, or a green pill when connected.
 */
import React, { useEffect, useState } from "react";
import { ExternalLink, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  baseUrl: string;
}

type Status = "loading" | "connected" | "disconnected" | "error";

export function JobberStatus({ baseUrl }: Props) {
  const [status, setStatus] = useState<Status>("loading");

  const check = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`${baseUrl}api/jobber/status`);
      const data = await res.json();
      setStatus(data.connected ? "connected" : "disconnected");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => { check(); }, [baseUrl]);

  // Check for ?jobber= redirect from OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobberParam = params.get("jobber");
    if (jobberParam === "connected") {
      setStatus("connected");
      // Clean the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("jobber");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const handleConnect = () => {
    window.location.href = `${baseUrl}api/jobber/auth`;
  };

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground text-sm animate-pulse">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        Checking Jobber…
      </div>
    );
  }

  if (status === "connected") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium border border-green-200 dark:border-green-800">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Jobber Connected
      </div>
    );
  }

  // disconnected or error — show connect prompt
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
      <span className="text-sm text-amber-800 dark:text-amber-300 font-medium">
        Jobber not connected
      </span>
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs ml-1 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100"
        onClick={handleConnect}
      >
        <ExternalLink className="w-3 h-3 mr-1" />
        Connect
      </Button>
    </div>
  );
}
