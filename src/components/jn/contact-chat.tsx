"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Step = "name" | "contact" | "message" | "review" | "sending" | "done";

interface Turn {
  from: "jn-1" | "user";
  text: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Loose international phone check — at least 7 digits, common punctuation ok. */
const PHONE = /^[+()\d][\d\s\-().]{6,}$/;

const PROMPTS: Record<Exclude<Step, "sending" | "done">, string> = {
  name: "Hey — I'm jn-1, running James's inbox. Three questions and I'll pass this straight to him. What should I call you?",
  contact:
    "Good to meet you. Where should he reply — email or phone, whichever you actually check?",
  message: "Last one. What's on your mind?",
  review: "Here's what I'll send. Look right?",
};

const PLACEHOLDERS: Record<Step, string> = {
  name: "Ada Lovelace",
  contact: "ada@company.com  ·  +1 555 010 1990",
  message: "We're hiring an ML engineer and your UAV tracking work caught my eye…",
  review: "",
  sending: "",
  done: "",
};

const INTENTS = ["I'm hiring", "Let's collaborate", "Question about a project", "Just saying hi"];

const LABELS: Record<Exclude<Step, "sending" | "done" | "review">, string> = {
  name: "Your name",
  contact: "Email or phone",
  message: "Your message",
};

function validate(step: Step, value: string): string | null {
  const v = value.trim();
  if (step === "name") {
    if (v.length < 2) return "I'll need something to call you — two characters or more.";
    if (v.length > 60) return "That's longer than 60 characters. Shorter is fine.";
  }
  if (step === "contact") {
    if (!EMAIL.test(v) && !PHONE.test(v)) {
      return "That doesn't parse as an email or a phone number. Try again?";
    }
    if (v.length > 120) return "That's too long to be either one.";
  }
  if (step === "message") {
    if (v.length < 4) return "Give me a little more than that.";
    if (v.length > 1200) return `That's ${v.length} characters — trim it to 1200 or fewer.`;
  }
  return null;
}

/**
 * "Chat with the model" — the contact form, walked one field at a time.
 *
 * Name → email or phone → message → confirm, then a single POST to /api.
 * Everything is a plain input under the hood, so it still works with a
 * keyboard and a screen reader; the terminal styling is the costume.
 */
export function ContactChat() {
  const [step, setStep] = useState<Step>("name");
  const [turns, setTurns] = useState<Turn[]>([{ from: "jn-1", text: PROMPTS.name }]);
  const [draft, setDraft] = useState("");
  const [answers, setAnswers] = useState({ name: "", contact: "", message: "" });
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Keep the newest turn in view without yanking the whole page around.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [turns, step]);

  const say = useCallback((from: Turn["from"], text: string) => {
    setTurns((prev) => [...prev, { from, text }]);
  }, []);

  const submitAnswer = () => {
    const value = draft.trim();
    const problem = validate(step, value);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setDraft("");
    say("user", value);

    if (step === "name") {
      setAnswers((a) => ({ ...a, name: value }));
      say("jn-1", `Noted, ${value}. ${PROMPTS.contact}`);
      setStep("contact");
      return;
    }
    if (step === "contact") {
      setAnswers((a) => ({ ...a, contact: value }));
      say("jn-1", PROMPTS.message);
      setStep("message");
      return;
    }
    if (step === "message") {
      setAnswers((a) => ({ ...a, message: value }));
      say("jn-1", PROMPTS.review);
      setStep("review");
    }
  };

  const send = async () => {
    setStep("sending");
    setError(null);
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const result = (await res.json()) as { message?: string };
      if (!res.ok)
        throw new Error(result.message ?? "Something went wrong. Try again in a moment.");
      say("jn-1", `Delivered. James usually replies the same day — watch ${answers.contact}.`);
      setStep("done");
    } catch (err) {
      setStep("review");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again in a moment.");
    }
  };

  const restart = () => {
    setAnswers({ name: "", contact: "", message: "" });
    setTurns([{ from: "jn-1", text: PROMPTS.name }]);
    setDraft("");
    setError(null);
    setStep("name");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const collecting = step === "name" || step === "contact" || step === "message";
  const progress = step === "name" ? 1 : step === "contact" ? 2 : 3;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
        <span className="h-[9px] w-[9px] rounded-full bg-amber" />
        <span className="h-[9px] w-[9px] rounded-full bg-border" />
        <span className="h-[9px] w-[9px] rounded-full bg-border" />
        <span className="ml-1.5 font-mono text-[11px] font-medium leading-none text-muted-foreground">
          POST /v1/messages
        </span>
        {collecting && (
          <span className="ml-auto font-mono text-[11px] font-medium leading-none text-muted-foreground">
            {progress}/3
          </span>
        )}
      </div>

      <div
        ref={logRef}
        className="max-h-[22rem] overflow-y-auto px-5 py-5 font-mono text-sm leading-[1.75]"
        aria-live="polite"
        aria-atomic="false"
      >
        {turns.map((turn, i) => (
          <p key={i} className={cn("text-pretty", i > 0 && "mt-2.5")}>
            <span className={turn.from === "jn-1" ? "text-primary" : "text-amber"}>
              {turn.from === "jn-1" ? "jn-1 ›" : "you ›"}
            </span>{" "}
            <span className={turn.from === "jn-1" ? "text-foreground" : "text-muted-foreground"}>
              {turn.text}
            </span>
          </p>
        ))}

        {step === "review" && (
          <dl className="mt-4 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-md border border-border bg-background p-4 text-[13px]">
            <dt className="text-muted-foreground">name</dt>
            <dd className="m-0 text-foreground">{answers.name}</dd>
            <dt className="text-muted-foreground">reply to</dt>
            <dd className="m-0 text-foreground">{answers.contact}</dd>
            <dt className="text-muted-foreground">message</dt>
            <dd className="m-0 whitespace-pre-wrap text-foreground">{answers.message}</dd>
          </dl>
        )}
      </div>

      <div className="border-t border-border px-5 py-4">
        {collecting && (
          <>
            {step === "message" && (
              <div className="mb-3 flex flex-wrap gap-2">
                {INTENTS.map((intent) => (
                  <button
                    key={intent}
                    type="button"
                    onClick={() => {
                      setDraft(intent.endsWith("hi") ? `${intent} — ` : `${intent}. `);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-border px-3 py-1.5 font-mono text-[11px] font-medium leading-none text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {intent}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitAnswer();
              }}
              className="flex items-center gap-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                {LABELS[step]}
              </label>
              <span aria-hidden className="font-mono text-sm leading-none text-amber">
                &#8250;
              </span>
              <input
                id="chat-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={PLACEHOLDERS[step]}
                autoComplete={step === "name" ? "name" : step === "contact" ? "email tel" : "off"}
                maxLength={step === "message" ? 1200 : 120}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "chat-error" : undefined}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-primary px-5 py-2.5 font-sans text-[13px] font-semibold leading-none text-primary-foreground transition-colors hover:bg-amber"
              >
                {step === "message" ? "Review" : "Next"}
              </button>
            </form>
          </>
        )}

        {(step === "review" || step === "sending") && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={send}
              disabled={step === "sending"}
              className="rounded-full bg-primary px-5 py-3 font-sans text-[13px] font-semibold leading-none text-primary-foreground transition-colors hover:bg-amber disabled:opacity-60"
            >
              {step === "sending" ? "Sending…" : "Send it"}
            </button>
            <button
              type="button"
              onClick={restart}
              disabled={step === "sending"}
              className="rounded-full border border-border px-5 py-3 font-sans text-[13px] font-semibold leading-none text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
            >
              Start over
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-primary">
              200 OK
            </span>
            <button
              type="button"
              onClick={restart}
              className="rounded-full border border-border px-5 py-3 font-sans text-[13px] font-semibold leading-none text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Send another
            </button>
          </div>
        )}

        {error && (
          <p
            id="chat-error"
            role="alert"
            className="mt-3 font-mono text-[11px] leading-relaxed text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
