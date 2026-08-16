"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { copy, fill } from "@/lib/copy";
import { cn } from "@/lib/utils";

type Step = "name" | "contact" | "message" | "review" | "sending" | "done";

interface Turn {
  from: "jn-1" | "user";
  text: string;
}

const c = copy.chat;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Loose international phone check — at least 7 digits, common punctuation ok. */
const PHONE = /^[+()\d][\d\s\-().]{6,}$/;

function validate(step: Step, value: string): string | null {
  const v = value.trim();
  if (step === "name") {
    if (v.length < 2) return c.validation.nameTooShort;
    if (v.length > 60) return c.validation.nameTooLong;
  }
  if (step === "contact") {
    if (!EMAIL.test(v) && !PHONE.test(v)) return c.validation.contactInvalid;
    if (v.length > 120) return c.validation.contactTooLong;
  }
  if (step === "message") {
    if (v.length < 4) return c.validation.messageTooShort;
    if (v.length > 1200) return fill(c.validation.messageTooLong, { count: v.length });
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
  const [turns, setTurns] = useState<Turn[]>([{ from: "jn-1", text: c.prompts.name }]);
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
      say("jn-1", `${fill(c.nameAcknowledgement, { name: value })} ${c.prompts.contact}`);
      setStep("contact");
      return;
    }
    if (step === "contact") {
      setAnswers((a) => ({ ...a, contact: value }));
      say("jn-1", c.prompts.message);
      setStep("message");
      return;
    }
    if (step === "message") {
      setAnswers((a) => ({ ...a, message: value }));
      say("jn-1", c.prompts.review);
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
      if (!res.ok) throw new Error(result.message ?? c.validation.genericError);
      say("jn-1", fill(c.successMessage, { contact: answers.contact }));
      setStep("done");
    } catch (err) {
      setStep("review");
      setError(err instanceof Error ? err.message : c.validation.genericError);
    }
  };

  const restart = () => {
    setAnswers({ name: "", contact: "", message: "" });
    setTurns([{ from: "jn-1", text: c.prompts.name }]);
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
          {c.endpointLabel}
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
            <dt className="text-muted-foreground">{c.reviewLabels.name}</dt>
            <dd className="m-0 text-foreground">{answers.name}</dd>
            <dt className="text-muted-foreground">{c.reviewLabels.contact}</dt>
            <dd className="m-0 text-foreground">{answers.contact}</dd>
            <dt className="text-muted-foreground">{c.reviewLabels.message}</dt>
            <dd className="m-0 whitespace-pre-wrap text-foreground">{answers.message}</dd>
          </dl>
        )}
      </div>

      <div className="border-t border-border px-5 py-4">
        {collecting && (
          <>
            {step === "message" && (
              <div className="mb-3 flex flex-wrap gap-2">
                {c.intents.map((intent) => (
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
                {c.labels[step]}
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
                placeholder={c.placeholders[step]}
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
                {step === "message" ? c.buttons.review : c.buttons.next}
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
              {step === "sending" ? c.buttons.sending : c.buttons.send}
            </button>
            <button
              type="button"
              onClick={restart}
              disabled={step === "sending"}
              className="rounded-full border border-border px-5 py-3 font-sans text-[13px] font-semibold leading-none text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
            >
              {c.buttons.restart}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-primary">
              {c.successBadge}
            </span>
            <button
              type="button"
              onClick={restart}
              className="rounded-full border border-border px-5 py-3 font-sans text-[13px] font-semibold leading-none text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {c.buttons.sendAnother}
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
