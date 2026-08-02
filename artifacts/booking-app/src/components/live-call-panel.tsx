import React, { useCallback, useEffect, useRef, useState } from "react";
import { Phone, PhoneOff, Mic, MicOff, Sparkles, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Extend window for SpeechRecognition cross-browser
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface ExtractedFields {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  serviceType?: string;
  bedrooms?: number;
  bathrooms?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  frequency?: string;
  notes?: string;
  extras?: string[];
}

interface LiveCallPanelProps {
  onFieldsExtracted: (fields: ExtractedFields, newKeys: string[]) => void;
  baseUrl: string;
}

const FIELD_LABELS: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  phone: "Phone",
  email: "Email",
  address: "Address",
  city: "City",
  postalCode: "Postal code",
  serviceType: "Service type",
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
  scheduledDate: "Date",
  scheduledTime: "Time",
  frequency: "Frequency",
  notes: "Notes",
  extras: "Extras",
};

export function LiveCallPanel({ onFieldsExtracted, baseUrl }: LiveCallPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [lastExtracted, setLastExtracted] = useState<ExtractedFields>({});
  const [filledCount, setFilledCount] = useState(0);
  const [micSupported, setMicSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check mic support
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setMicSupported(!!SR);
  }, []);

  const extractFromTranscript = useCallback(
    async (text: string) => {
      if (text.trim().length < 5) return;
      setIsExtracting(true);
      try {
        const resp = await fetch(`${baseUrl}api/ai/extract-booking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: text }),
        });
        if (!resp.ok) return;
        const fields: ExtractedFields = await resp.json();

        // Figure out which fields are newly filled vs before
        const newKeys = Object.keys(fields).filter((k) => {
          const prev = (lastExtracted as any)[k];
          const curr = (fields as any)[k];
          if (Array.isArray(curr)) return curr.length > 0 && JSON.stringify(curr) !== JSON.stringify(prev);
          return curr !== undefined && curr !== "" && curr !== prev;
        });

        if (newKeys.length > 0) {
          setLastExtracted(fields);
          setFilledCount((n) => n + newKeys.length);
          onFieldsExtracted(fields, newKeys);
        }
      } catch {
        // silently ignore
      } finally {
        setIsExtracting(false);
      }
    },
    [lastExtracted, onFieldsExtracted, baseUrl]
  );

  // Debounce extraction when transcript changes
  useEffect(() => {
    if (!transcript.trim()) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      extractFromTranscript(transcript);
    }, 1400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [transcript, extractFromTranscript]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-CA";

    let finalSoFar = transcript;

    recognition.onresult = (event) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalSoFar += (finalSoFar ? " " : "") + event.results[i][0].transcript.trim();
        } else {
          interimText += event.results[i][0].transcript;
        }
      }
      setTranscript(finalSoFar + (interimText ? " " + interimText : ""));
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [transcript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleClear = () => {
    stopListening();
    setTranscript("");
    setLastExtracted({});
    setFilledCount(0);
  };

  const filledFieldLabels = Object.keys(lastExtracted)
    .filter((k) => {
      const v = (lastExtracted as any)[k];
      return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== "";
    })
    .map((k) => FIELD_LABELS[k] ?? k);

  return (
    <div
      className={cn(
        "rounded-2xl border-2 transition-all duration-300 overflow-hidden",
        isOpen
          ? "border-pink-400/60 bg-gradient-to-br from-pink-50/80 to-purple-50/80 dark:from-pink-950/30 dark:to-purple-950/30 shadow-lg shadow-pink-500/10"
          : "border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
      )}
    >
      {/* Header / toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
      >
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
            isListening
              ? "bg-pink-500 shadow-lg shadow-pink-500/40 animate-pulse"
              : isOpen
              ? "bg-primary/15"
              : "bg-primary/10"
          )}
        >
          <Phone className={cn("w-4 h-4", isListening ? "text-white" : "text-primary")} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            Live Call Mode
            {filledCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                <Sparkles className="w-3 h-3" />
                {filledCount} field{filledCount !== 1 ? "s" : ""} filled
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {isListening
              ? "Listening… speak naturally"
              : isOpen
              ? "Type what you hear, or tap the mic"
              : "Tap to open — AI fills the form as you talk"}
          </p>
        </div>

        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Expanded body */}
      {isOpen && (
        <div className="px-5 pb-5 space-y-4">
          {/* Transcript area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Start typing what the customer says, or tap the mic button to listen…&#10;&#10;e.g. 'Hi my name is Sarah Johnson, I'm at 142 Oak Street in Edmonton, I'd like a deep clean for my 3 bed 2 bath place next Friday at 10am'"
              rows={5}
              className={cn(
                "w-full resize-none rounded-xl border bg-white/80 dark:bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all",
                isListening && "ring-2 ring-pink-400/60 border-pink-300"
              )}
            />
            {transcript && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-muted/70 hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {micSupported ? (
              <Button
                type="button"
                variant={isListening ? "destructive" : "default"}
                size="sm"
                onClick={isListening ? stopListening : startListening}
                className={cn(
                  "gap-2 flex-shrink-0",
                  isListening && "animate-pulse shadow-lg shadow-red-500/20"
                )}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Stop Mic
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Start Mic
                  </>
                )}
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Mic not supported in this browser — type above instead
              </p>
            )}

            <div className="flex-1 min-w-0">
              {isExtracting && (
                <p className="text-xs text-primary flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  Reading transcript…
                </p>
              )}
              {!isExtracting && filledFieldLabels.length > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 truncate">
                  ✓ Filled: {filledFieldLabels.join(", ")}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => extractFromTranscript(transcript)}
              disabled={!transcript.trim() || isExtracting}
              className="flex-shrink-0 text-xs"
            >
              Re-scan
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/60 leading-relaxed">
            Put the call on speaker near your computer, or type/paste what you hear. The AI reads the
            transcript and fills the form below in real time.
          </p>
        </div>
      )}
    </div>
  );
}
