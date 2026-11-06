"use client";

import "@/shared/lib/zod-csp";

import { useAction } from "next-safe-action/hooks";
import { useState, type SubmitEvent } from "react";

import { Button } from "@/shared/ui/button";
import { ChevronDownIcon } from "@/shared/ui/icons";

import { captureLeadAction } from "./capture-lead-action";
import { HONEYPOT_FIELD, LeadInputSchema, type LeadProfile } from "./lead";

type Labels = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  profileLabel: string;
  profiles: { value: LeadProfile; label: string }[];
  submit: string;
  sending: string;
  success: string;
  rateLimited: string;
  serverError: string;
};

type Field = "name" | "email" | "profile";

const STATUS_ID = "cod-lead-status";

const fieldClass =
  "box-border h-[52px] w-full rounded-full border border-white/30 bg-surface-100 px-5.5 font-sans text-15 text-white";

export function LeadForm({ labels }: { labels: Labels }) {
  const [clientError, setClientError] = useState<{ field: Field; message: string } | null>(null);
  const { execute, result, isExecuting, hasErrored } = useAction(captureLeadAction);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const field = (name: string) => {
      const value = form.get(name);
      return typeof value === "string" ? value : "";
    };
    const input = {
      name: field("name"),
      email: field("email"),
      profile: field("profile"),
      [HONEYPOT_FIELD]: field(HONEYPOT_FIELD),
    };
    const parsed = LeadInputSchema.safeParse(input);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setClientError(issue ? { field: issue.path[0] as Field, message: issue.message } : null);
      return;
    }
    setClientError(null);
    execute(parsed.data);
  };

  const outcome = result.data;
  const error =
    clientError?.message ??
    (outcome?.status === "invalid" ? outcome.message : null) ??
    (outcome?.status === "rate-limited" ? labels.rateLimited : null) ??
    (hasErrored ? labels.serverError : null);
  const status = isExecuting
    ? labels.sending
    : outcome?.status === "captured"
      ? labels.success
      : null;
  const invalid = (name: Field) => (clientError?.field === name ? true : undefined);

  return (
    <form noValidate onSubmit={onSubmit} className="relative">
      <div className="mt-6.5 flex max-w-[520px] flex-wrap gap-3">
        <div className="relative flex-[1_1_200px]">
          <label htmlFor="cod-name" className="sr-only">
            {labels.nameLabel}
          </label>
          <input
            id="cod-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={labels.namePlaceholder}
            aria-invalid={invalid("name")}
            aria-describedby={STATUS_ID}
            className={fieldClass}
          />
        </div>
        <div className="relative flex-[1_1_200px]">
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
            aria-invalid={invalid("email")}
            aria-describedby={STATUS_ID}
            className={fieldClass}
          />
        </div>
        <div className="relative flex-[1_1_100%]">
          <label htmlFor="cod-profile" className="sr-only">
            {labels.profileLabel}
          </label>
          <select
            id="cod-profile"
            name="profile"
            required
            defaultValue={labels.profiles[0]?.value}
            aria-invalid={invalid("profile")}
            aria-describedby={STATUS_ID}
            className={`${fieldClass} cursor-pointer appearance-none`}
          >
            {labels.profiles.map((profile) => (
              <option key={profile.value} value={profile.value}>
                {profile.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-4.5 right-5.5 text-white" />
        </div>
        {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] size-px opacity-0"
        />
        <Button
          type="submit"
          disabled={isExecuting}
          className="min-h-[52px] flex-[1_1_100%] justify-center px-5.5 text-15"
        >
          {labels.submit}
        </Button>
      </div>
      <p
        id={STATUS_ID}
        role={error ? "alert" : "status"}
        aria-live={error ? "assertive" : "polite"}
        className="absolute top-full left-5.5 m-0 mt-2 text-14 text-fg-muted empty:hidden"
      >
        {error ?? status}
      </p>
    </form>
  );
}
