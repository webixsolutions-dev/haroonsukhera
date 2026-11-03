"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { contactCopy } from "@/content/copy/contact";
import { doors, type ClientType } from "@/content/copy/shared";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function ContactAdaptiveForm() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as ClientType;

  const [clientType, setClientType] = useState<ClientType>("business");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");

  // Business fields
  const [company, setCompany] = useState("");
  const [businessNeed, setBusinessNeed] = useState("Website");
  const [timing, setTiming] = useState("This month");

  // Individual fields
  const [task, setTask] = useState("One page");

  // Freelancer fields
  const [deadline, setDeadline] = useState("");
  const [whiteLabel, setWhiteLabel] = useState("Yes");
  const [nda, setNda] = useState("Yes");

  // Honeypot
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    if (typeParam && (typeParam === "business" || typeParam === "individual" || typeParam === "freelancer")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientType(typeParam);
    }
  }, [typeParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const payload = {
        type: clientType,
        name,
        email,
        whatsapp,
        website,
        message,
        company: clientType === "business" ? company : undefined,
        businessNeed: clientType === "business" ? businessNeed : undefined,
        timing: clientType === "business" ? timing : undefined,
        task: clientType === "individual" ? task : undefined,
        deadline: clientType === "freelancer" ? deadline : undefined,
        whiteLabel: clientType === "freelancer" ? whiteLabel : undefined,
        nda: clientType === "freelancer" ? nda : undefined,
        honeypot,
      };

      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Submission failed");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      const message = err instanceof Error ? err.message : contactCopy.error;
      setErrorMessage(message);
    }
  };

  return (
    <div id="contact-form-section">
      {/* Doors selection */}
      <div className="mb-10">
        <h2 className="t-h3 mb-5 text-white">{contactCopy.doorsH2}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {doors.map((door, idx) => {
            const isSelected = clientType === door.type;
            return (
              <button
                key={door.type}
                type="button"
                onClick={() => setClientType(door.type)}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-[22px] border p-5 text-left transition-all duration-200",
                  isSelected
                    ? "border-molten bg-molten/15 text-white shadow-[0_18px_45px_-15px_rgba(255,90,31,0.45)]"
                    : "border-white/14 bg-white/[0.04] text-fog hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
                )}
              >
                <div>
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/12 bg-obsidian/80 p-1">
                        <Image
                          src={door.image}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <span className="block font-display text-xs font-extrabold text-molten-soft">
                          0{idx + 1}
                        </span>
                        <span className="font-display text-lg font-bold text-white">
                          {door.title}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        isSelected
                          ? "border-molten bg-molten"
                          : "border-white/30"
                      )}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-ink" />
                      )}
                    </span>
                  </div>
                  <p className="t-small mt-3.5 leading-relaxed text-white/80">
                    {door.body}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Adaptive Form in Liquid Glass */}
      <Glass variant="text" refract className="p-6 sm:p-8 md:p-10 lg:p-12">
        {status === "success" ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-2xl">
              <Image
                src="/images/misc/success-tile.webp"
                alt=""
                fill
                sizes="112px"
                className="object-contain"
              />
            </div>
            <h3 className="t-h2 text-white">Message sent</h3>
            <p className="t-lead mt-3 text-fog">{contactCopy.success}</p>
            <div className="mt-8">
              <Button
                variant="glass"
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                }}
              >
                Send another message
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                  {contactCopy.fields.name} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-molten focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                  {contactCopy.fields.email} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-molten focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* WhatsApp (optional) */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                  {contactCopy.fields.whatsapp}
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1 555 0192"
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-molten focus:outline-none"
                />
              </div>

              {/* Website (optional) */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                  {contactCopy.fields.website}
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-molten focus:outline-none"
                />
              </div>
            </div>

            {/* Business Specific */}
            {clientType === "business" && (
              <div className="space-y-6 border-t border-white/10 pt-6">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                    {contactCopy.fields.company}
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company or business name"
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-molten focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                    {contactCopy.fields.businessNeeds}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {contactCopy.fields.businessNeedsOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setBusinessNeed(opt)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                          businessNeed === opt
                            ? "border-molten bg-molten text-ink font-bold"
                            : "border-white/15 bg-white/5 text-fog hover:border-white/30 hover:text-white"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                    {contactCopy.fields.timing}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {contactCopy.fields.timingOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTiming(opt)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                          timing === opt
                            ? "border-molten bg-molten text-ink font-bold"
                            : "border-white/15 bg-white/5 text-fog hover:border-white/30 hover:text-white"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Individual Specific */}
            {clientType === "individual" && (
              <div className="space-y-6 border-t border-white/10 pt-6">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                    {contactCopy.fields.task}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {contactCopy.fields.taskOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTask(opt)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                          task === opt
                            ? "border-molten bg-molten text-ink font-bold"
                            : "border-white/15 bg-white/5 text-fog hover:border-white/30 hover:text-white"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Freelancer/Agency Specific */}
            {clientType === "freelancer" && (
              <div className="space-y-6 border-t border-white/10 pt-6">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                    {contactCopy.fields.deadline}
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-molten focus:outline-none"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                      {contactCopy.fields.whiteLabel}
                    </label>
                    <div className="flex gap-2">
                      {contactCopy.fields.yesNo.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setWhiteLabel(opt)}
                          className={cn(
                            "flex-1 rounded-xl border py-2.5 text-xs font-medium transition-colors",
                            whiteLabel === opt
                              ? "border-molten bg-molten text-ink font-bold"
                              : "border-white/15 bg-white/5 text-fog hover:border-white/30 hover:text-white"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                      {contactCopy.fields.nda}
                    </label>
                    <div className="flex gap-2">
                      {contactCopy.fields.yesNo.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setNda(opt)}
                          className={cn(
                            "flex-1 rounded-xl border py-2.5 text-xs font-medium transition-colors",
                            nda === opt
                              ? "border-molten bg-molten text-ink font-bold"
                              : "border-white/15 bg-white/5 text-fog hover:border-white/30 hover:text-white"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="border-t border-white/10 pt-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fog">
                {contactCopy.fields.message} *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me what you need, your current site link if you have one, and when you need it..."
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-molten focus:outline-none"
              />
            </div>

            {/* Honeypot field (hidden from real users) */}
            <input
              type="text"
              name="hp_contact"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
            />

            {status === "error" && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {errorMessage || contactCopy.error}
              </p>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={status === "submitting"}
                className="w-full sm:w-auto"
              >
                {status === "submitting" ? "Sending..." : contactCopy.submit}
              </Button>
            </div>
          </form>
        )}
      </Glass>
    </div>
  );
}
