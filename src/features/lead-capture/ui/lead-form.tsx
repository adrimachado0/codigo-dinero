"use client";

import { useAction } from "next-safe-action/hooks";
import { useState, type SubmitEvent } from "react";

import { Button } from "@/shared/ui/button";

import { HONEYPOT_FIELD, LeadInputSchema } from "../domain/lead";
import { captureLeadAction } from "./capture-lead-action";

type Labels = {
  emailLabel: string;
  emailPlaceholder: string;
  submit: string;
  sending: string;
  success: string;
  rateLimited: string;
  serverError: string;
};

export function LeadForm({ labels }: { labels: Labels }) {
  const [clientError, setClientError] = useState<string | null>(null);
  const { execute, result, isExecuting, hasErrored } = useAction(captureLeadAction);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const field = (name: string) => {
      const value = form.get(name);
      return typeof value === "string" ? value : "";
    };
    const input = { email: field("email"), [HONEYPOT_FIELD]: field(HONEYPOT_FIELD) };
    const parsed = LeadInputSchema.safeParse(input);
    if (!parsed.success) {
      setClientError(parsed.error.issues[0]?.message ?? null);
      return;
    }
    setClientError(null);
    execute(input);
  };

  const outcome = result.data;
  const error =
    clientError ??
    (outcome?.status === "invalid" ? outcome.message : null) ??
    (outcome?.status === "rate-limited" ? labels.rateLimited : null) ??
    (hasErrored ? labels.serverError : null);
  const status = isExecuting
    ? labels.sending
    : outcome?.status === "captured"
      ? labels.success
      : null;

  return (
    <form noValidate onSubmit={onSubmit} className="relative">
      <div className="mt-6.5 box-border flex max-w-[460px] items-center gap-1.5 rounded-full border border-white/30 py-1.5 pr-1.5 pl-5.5 focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-accent focus-within:outline-solid">
        <label htmlFor="cod-email" className="sr-only">
          {labels.emailLabel}
        </label>
        <input
          id="cod-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={labels.emailPlaceholder}
          aria-invalid={error ? true : undefined}
          aria-describedby="cod-email-status"
          className="h-11 min-w-0 flex-auto border-0 bg-transparent font-sans text-15 text-white outline-none focus-visible:outline-none"
        />
        {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] size-px opacity-0"
        />
        <Button type="submit" disabled={isExecuting} className="flex-none px-5.5">
          {labels.submit}
        </Button>
      </div>
      <p
        id="cod-email-status"
        role={error ? "alert" : "status"}
        aria-live={error ? "assertive" : "polite"}
        className="absolute top-full left-5.5 m-0 mt-2 text-14 text-fg-muted empty:hidden"
      >
        {error ?? status}
      </p>
    </form>
  );
}
