/**
 * Shows Jobber sync status on a booking detail page.
 * If jobberJobId is set → shows link. If not → shows "Sync to Jobber" button.
 */
import React, { useState } from "react";
import { ExternalLink, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  bookingId: number;
  jobberJobId?: string | null;
  onSynced?: (jobberRequestId: string) => void;
  baseUrl: string;
}

// Construct a link to the Jobber request (web app URL pattern)
function jobberRequestUrl(id: string) {
  return `https://secure.getjobber.com/requests/${id}`;
}

export function JobberSyncCard({ bookingId, jobberJobId, onSynced, baseUrl }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localId, setLocalId] = useState(jobberJobId);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}api/jobber/sync/${bookingId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setLocalId(data.jobberRequestId);
      onSynced?.(data.jobberRequestId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          {/* Jobber brand icon via initials */}
          <span className="w-5 h-5 rounded bg-[#F4B400] text-white text-xs font-black flex items-center justify-center leading-none">J</span>
          Jobber
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        {localId ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Synced to Jobber</span>
            </div>
            <div className="bg-muted/50 rounded-lg px-3 py-2 text-xs font-mono text-muted-foreground break-all">
              {localId}
            </div>
            <a
              href={jobberRequestUrl(localId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Jobber
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This booking hasn't been pushed to Jobber yet.
            </p>
            {error && (
              <div className="flex items-start gap-2 text-destructive text-xs bg-destructive/10 rounded-lg p-2">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}
            <Button
              size="sm"
              onClick={handleSync}
              disabled={syncing}
              className="w-full gap-2"
            >
              {syncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span className="w-4 h-4 rounded bg-[#F4B400] text-white text-xs font-black flex items-center justify-center leading-none">J</span>
              )}
              {syncing ? "Syncing…" : "Create Request in Jobber"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
