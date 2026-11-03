"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  Download,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { BOOKING_CONFIG, type MeetingTypeConfig } from "@/config/booking";
import { SERVICES_REGISTRY } from "@/content/services";
import { SITE_FACTS } from "@/content/site-facts";
import { WhatsAppIcon } from "@/components/layout/social-icons";
import { TimezoneSelect } from "./timezone-select";
import {
  generateIcsContent,
  downloadIcsFile,
  getGoogleCalendarAddUrl,
} from "./ics-generator";
import type { FormattedSlot } from "@/lib/booking/slot-engine";

export interface BookingWidgetProps {
  variant?: "full" | "compact";
  defaultMeetingType?: "strategy" | "intro" | "partner";
  sourcePage?: string;
  className?: string;
}

interface BookApiResponse {
  success: boolean;
  eventId?: string;
  meetUrl?: string;
  startIso?: string;
  endIso?: string;
  summary?: string;
  attendeeEmail?: string;
  error?: string;
}

export function BookingWidget({
  variant = "full",
  defaultMeetingType = "strategy",
  sourcePage = "Direct",
  className = "",
}: BookingWidgetProps) {
  // Steps: 1: type, 2: date/time, 3: details, 4: confirmed
  // For compact variant, default directly to step 2 (date/time)
  const [step, setStep] = React.useState<number>(variant === "compact" ? 2 : 1);
  const [selectedType, setSelectedType] = React.useState<"strategy" | "intro" | "partner">(defaultMeetingType);
  const [visitorTz, setVisitorTz] = React.useState<string>(BOOKING_CONFIG.hostTimeZone);
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [selectedSlot, setSelectedSlot] = React.useState<FormattedSlot | null>(null);

  // Form fields
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [budget, setBudget] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [honeypot, setHoneypot] = React.useState("");

  // API states
  const [availableSlots, setAvailableSlots] = React.useState<FormattedSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = React.useState(false);
  const [bookedResult, setBookedResult] = React.useState<BookApiResponse | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = React.useState("");

  // Calendar view month state
  const [currentCalendarMonth, setCurrentCalendarMonth] = React.useState<Date>(() => new Date());

  // Detect visitor timezone on mount & sync URL state
  React.useEffect(() => {
    try {
      const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (resolved) {
        setVisitorTz(resolved);
      }
    } catch {
      // fallback to host
    }

    if (variant === "full" && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlType = params.get("type");
      if (urlType === "strategy" || urlType === "intro" || urlType === "partner") {
        setSelectedType(urlType);
      }
      const urlDate = params.get("date");
      if (urlDate) {
        setSelectedDate(urlDate);
      }
    }
  }, [variant]);

  // Fetch slots whenever selectedType or visitorTz changes
  React.useEffect(() => {
    let isCancelled = false;
    setIsLoadingSlots(true);
    setErrorMessage(null);

    const now = new Date();
    const fromStr = now.toISOString().split("T")[0];
    const future = new Date(now.getTime() + BOOKING_CONFIG.maxDaysAhead * 24 * 3600 * 1000);
    const toStr = future.toISOString().split("T")[0];

    const url = `/api/booking/slots?type=${selectedType}&from=${fromStr}&to=${toStr}&tz=${encodeURIComponent(visitorTz)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (isCancelled) return;
        if (data.fallback) {
          setIsFallbackMode(true);
          setAvailableSlots([]);
        } else if (Array.isArray(data.slots)) {
          setAvailableSlots(data.slots);
          setIsFallbackMode(false);
          if (data.slots.length > 0 && !selectedDate) {
            setSelectedDate(data.slots[0].visitorDateKey);
          }
        }
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error("Failed to load booking slots:", err);
        setIsFallbackMode(true);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingSlots(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedType, visitorTz]);

  // Sync URL when parameters change (full page only)
  React.useEffect(() => {
    if (variant === "full" && typeof window !== "undefined" && window.history.replaceState) {
      const params = new URLSearchParams(window.location.search);
      params.set("type", selectedType);
      if (selectedDate) params.set("date", selectedDate);
      if (selectedSlot) params.set("slot", selectedSlot.iso);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [selectedType, selectedDate, selectedSlot, variant]);

  // Group slots by visitorDateKey
  const slotsByDate = React.useMemo(() => {
    const map = new Map<string, FormattedSlot[]>();
    for (const slot of availableSlots) {
      const list = map.get(slot.visitorDateKey) || [];
      list.push(slot);
      map.set(slot.visitorDateKey, list);
    }
    return map;
  }, [availableSlots]);

  const activeMeetingConfig: MeetingTypeConfig =
    BOOKING_CONFIG.meetingTypes.find((m) => m.slug === selectedType) ||
    BOOKING_CONFIG.meetingTypes[0];

  const currentDaySlots = selectedDate ? slotsByDate.get(selectedDate) || [] : [];

  const handleSelectSlot = (slot: FormattedSlot) => {
    setSelectedSlot(slot);
    setLiveAnnouncement(`Selected time: ${slot.visitorTimeFormatted} ${slot.visitorTzAbbr}`);
    setStep(3); // advance to details
  };

  const toggleService = (slug: string) => {
    setSelectedServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Submit booking
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage("Please select a time slot first.");
      setStep(2);
      return;
    }

    if (!name.trim() || !email.trim()) {
      setErrorMessage("Please enter both your name and email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        meetingType: selectedType,
        slotIso: selectedSlot.iso,
        visitorTz,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        services: selectedServices,
        budget: budget || undefined,
        notes: notes.trim() || undefined,
        honeypot,
        sourcePage,
      };

      const res = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as BookApiResponse;

      if (!res.ok) {
        if (res.status === 409) {
          setErrorMessage("That time was just taken — please pick another available slot.");
          setStep(2); // back to slot picker
        } else {
          setErrorMessage(data.error || "Unable to confirm booking. Please try again or WhatsApp us.");
        }
        return;
      }

      setBookedResult(data);
      setStep(4); // Success screen
      setLiveAnnouncement("Meeting confirmed! Google Meet link has been created.");
    } catch (err) {
      console.error("Booking submission error:", err);
      setErrorMessage("Network connection error. Please try again or reach us directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Monthly calendar dates generator (desktop full variant)
  const calendarDays = React.useMemo(() => {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      hasSlots: boolean;
    }> = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        dateStr: "",
        dayNumber: 0,
        isCurrentMonth: false,
        hasSlots: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const hasSlots = (slotsByDate.get(dateStr) || []).length > 0;
      days.push({
        dateStr,
        dayNumber: day,
        isCurrentMonth: true,
        hasSlots,
      });
    }

    return days;
  }, [currentCalendarMonth, slotsByDate]);

  // Mobile / compact week strip generator
  const mobileDates = React.useMemo(() => {
    const list: Array<{
      dateStr: string;
      weekday: string;
      dayNum: string;
      hasSlots: boolean;
    }> = [];
    const base = new Date();
    for (let i = 0; i < (variant === "compact" ? 10 : 21); i++) {
      const d = new Date(base.getTime() + i * 24 * 3600 * 1000);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${day}`;
      const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = String(d.getDate());
      list.push({
        dateStr,
        weekday,
        dayNum,
        hasSlots: (slotsByDate.get(dateStr) || []).length > 0,
      });
    }
    return list;
  }, [slotsByDate, variant]);

  // Production Fallback view (Correction #2)
  if (isFallbackMode) {
    return (
      <div className={`cut-tr-lg border border-white/15 bg-[#121214] p-6 sm:p-8 text-white ${className}`}>
        <div className="flex items-center gap-3 text-[#ED1C24] mb-3">
          <Clock className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Direct Scheduling
          </span>
        </div>
        <h3 className="type-h3 text-white mb-2">
          Reserve a strategy call directly with our leads
        </h3>
        <p className="type-body text-[#9CA3AF] mb-6 max-w-xl">
          Pick a time on WhatsApp or email — we work Eastern, Pacific, UAE, NZ and Pakistan hours with dedicated morning and evening shifts.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={SITE_FACTS.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2.5 cut-tr-sm bg-[#16A34A] hover:bg-[#15803D] px-6 text-sm font-semibold text-white transition-colors"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>Chat on WhatsApp ({SITE_FACTS.contact.phoneDisplay})</span>
          </a>
          <a
            href={`mailto:${SITE_FACTS.contact.email}?subject=Strategy%20Call%20Booking`}
            className="inline-flex h-12 items-center justify-center gap-2 cut-tr-sm border border-white/20 bg-white/5 hover:bg-white/10 px-5 text-sm font-medium text-white transition-colors"
          >
            <span>Email {SITE_FACTS.contact.email}</span>
          </a>
        </div>
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#9CA3AF]">
          <div>• 30-min Google Meet session</div>
          <div>• Dedicated scope & quote in 48h</div>
          <div>• Zero sales pitch — engineering only</div>
        </div>
      </div>
    );
  }

  // Success Step (Step 4)
  if (step === 4 && bookedResult) {
    const meetUrl = bookedResult.meetUrl || "https://meet.google.com";
    const icsContent = generateIcsContent({
      title: bookedResult.summary || `${activeMeetingConfig.title} — Webix Solutions`,
      description: `Strategy session with Webix Solutions senior leads.\nGoogle Meet: ${meetUrl}`,
      startIso: bookedResult.startIso || selectedSlot?.iso || new Date().toISOString(),
      endIso: bookedResult.endIso || selectedSlot?.endIso || new Date().toISOString(),
      location: meetUrl,
      url: meetUrl,
    });

    const googleCalendarUrl = getGoogleCalendarAddUrl({
      title: bookedResult.summary || `${activeMeetingConfig.title} — Webix Solutions`,
      description: `Webix Solutions Call\nGoogle Meet: ${meetUrl}`,
      startIso: bookedResult.startIso || selectedSlot?.iso || new Date().toISOString(),
      endIso: bookedResult.endIso || selectedSlot?.endIso || new Date().toISOString(),
      location: meetUrl,
    });

    return (
      <div className={`cut-tr-lg border border-[#16A34A]/40 bg-[#0E1512] p-6 text-white ${className}`}>
        <div className="flex items-center gap-3 text-[#16A34A] mb-3">
          <CheckCircle2 className="h-7 w-7" />
          <div>
            <h3 className="font-display text-lg font-bold text-white">You&apos;re booked!</h3>
            <p className="text-xs text-[#86EFAC]">
              Google Meet invite created successfully.
            </p>
          </div>
        </div>

        <div className="my-4 cut-tr-sm border border-white/10 bg-white/[0.03] p-4 space-y-2">
          <div className="text-sm font-semibold text-white">
            {activeMeetingConfig.title} ({activeMeetingConfig.minutes}m)
          </div>
          {selectedSlot && (
            <div className="text-xs text-[#D1D5DB]">
              {selectedSlot.visitorDateKey} at{" "}
              <span className="font-semibold text-white">
                {selectedSlot.visitorTimeFormatted} {selectedSlot.visitorTzAbbr}
              </span>
            </div>
          )}
          <div className="text-xs text-[#9CA3AF]">
            Invite sent to: <span className="text-white">{email}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 my-4">
          <a
            href={meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 cut-tr-sm bg-[#C8101A] hover:bg-[#ED1C24] px-4 text-xs font-semibold text-white transition-colors"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Join Google Meet</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-1.5 cut-tr-sm border border-white/20 bg-white/5 hover:bg-white/10 px-3 text-xs font-medium text-white transition-colors"
          >
            <CalendarCheck className="h-3.5 w-3.5 text-[#ED1C24]" />
            <span>Google Calendar</span>
          </a>
          <button
            type="button"
            onClick={() => downloadIcsFile("webix-strategy-call.ics", icsContent)}
            className="inline-flex h-10 items-center justify-center gap-1.5 cut-tr-sm border border-white/20 bg-white/5 hover:bg-white/10 px-3 text-xs font-medium text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#9CA3AF]" />
            <span>.ics</span>
          </button>
        </div>

        <div className="pt-3 border-t border-white/10 text-xs text-[#9CA3AF] flex items-center justify-between">
          <span>Need to reschedule?</span>
          <a
            href={SITE_FACTS.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#25D366] hover:underline"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    );
  }

  // COMPACT VARIANT: Sleek inline widget for CTA sections
  if (variant === "compact") {
    return (
      <div className={`cut-tr-lg border border-white/15 bg-white/[0.04] backdrop-blur-md p-5 sm:p-6 text-white ${className}`}>
        {/* Live Region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-3 flex items-center gap-2 cut-tr-sm border border-[#ED1C24]/50 bg-[#ED1C24]/10 p-2.5 text-xs text-white">
            <AlertCircle className="h-3.5 w-3.5 text-[#ED1C24] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Compact Step 2: Slot Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
              <span className="inline-flex items-center gap-2 font-medium text-white">
                <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                <span>{activeMeetingConfig.title} ({activeMeetingConfig.minutes}m)</span>
              </span>
              <TimezoneSelect value={visitorTz} onChange={setVisitorTz} />
            </div>

            {isLoadingSlots ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-[#9CA3AF]">
                <Loader2 className="h-5 w-5 animate-spin text-[#ED1C24]" />
                <span>Finding open times in your zone...</span>
              </div>
            ) : (
              <>
                {/* Horizontal Date Strip */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-[#9CA3AF] font-medium">Select a day:</div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {mobileDates.slice(0, 7).map((md) => {
                      const isSelected = selectedDate === md.dateStr;
                      return (
                        <button
                          key={md.dateStr}
                          type="button"
                          disabled={!md.hasSlots}
                          onClick={() => {
                            setSelectedDate(md.dateStr);
                            setLiveAnnouncement(`Selected ${md.dateStr}`);
                          }}
                          className={`flex-shrink-0 w-12 py-2 px-1 rounded text-center border transition-all text-xs ${
                            isSelected
                              ? "border-[#ED1C24] bg-[#C8101A] text-white font-bold"
                              : md.hasSlots
                              ? "border-white/15 bg-white/[0.04] text-white hover:border-white/30"
                              : "border-white/5 bg-transparent text-[#4B5563] opacity-40 cursor-not-allowed"
                          }`}
                        >
                          <div className="text-[9px] uppercase font-mono">{md.weekday}</div>
                          <div className="font-semibold text-sm">{md.dayNum}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Slots */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
                    <span>Pick a slot to reserve:</span>
                    <span className="text-[#ED1C24] font-medium">
                      {currentDaySlots.length} available
                    </span>
                  </div>

                  {currentDaySlots.length === 0 ? (
                    <div className="p-4 border border-white/10 rounded bg-white/[0.02] text-center text-xs text-[#9CA3AF]">
                      No open slots on this date. Select another day above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {currentDaySlots.slice(0, 6).map((slot) => (
                        <button
                          key={slot.iso}
                          type="button"
                          onClick={() => handleSelectSlot(slot)}
                          className="p-2 cut-tr-sm border border-white/15 bg-white/[0.05] hover:border-[#ED1C24] hover:bg-[#ED1C24]/10 text-xs font-semibold text-white transition-colors flex items-center justify-between"
                        >
                          <span className="font-mono">{slot.visitorTimeFormatted}</span>
                          <span className="text-[10px] text-[#9CA3AF]">{slot.visitorTzAbbr}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <Link
                    href="/book-a-call/"
                    className="text-[#9CA3AF] hover:text-white transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>Full calendar view</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <span className="text-[11px] text-[#9CA3AF]">
                    48h written proposal
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Compact Step 3: Quick Details Form */}
        {step === 3 && (
          <form onSubmit={handleSubmitBooking} className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
              <span className="font-semibold text-white">Your details</span>
              {selectedSlot && (
                <span className="text-[#ED1C24] font-mono text-[11px]">
                  {selectedSlot.visitorDateKey} · {selectedSlot.visitorTimeFormatted}
                </span>
              )}
            </div>

            {/* Hidden Honeypot */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name *"
                className="w-full bg-[#1A1A1E] border border-white/15 cut-tr-sm px-3 py-2 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#ED1C24]"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address *"
                className="w-full bg-[#1A1A1E] border border-white/15 cut-tr-sm px-3 py-2 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#ED1C24]"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="WhatsApp or Phone (Optional)"
                className="w-full bg-[#1A1A1E] border border-white/15 cut-tr-sm px-3 py-2 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#ED1C24]"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Website or Project Goal (Optional)"
                className="w-full bg-[#1A1A1E] border border-white/15 cut-tr-sm px-3 py-2 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#ED1C24]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-[11px] text-[#9CA3AF] hover:text-white"
              >
                ← Back to times
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center gap-2 cut-tr-sm bg-[#C8101A] hover:bg-[#ED1C24] disabled:opacity-60 px-5 text-xs font-semibold text-white transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Call</span>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // FULL VARIANT
  return (
    <div className={`cut-tr-lg border border-white/15 bg-[#121214] p-5 sm:p-8 text-white ${className}`}>
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* No-JS Fallback */}
      <noscript>
        <div className="p-4 mb-4 bg-[#ED1C24]/10 border border-[#ED1C24]/30 rounded text-xs text-white">
          JavaScript is currently disabled. To schedule your call directly, email{" "}
          <a href={`mailto:${SITE_FACTS.contact.email}`} className="underline font-semibold">
            {SITE_FACTS.contact.email}
          </a>{" "}
          or message us on WhatsApp at{" "}
          <a href={SITE_FACTS.contact.whatsappUrl} className="underline font-semibold">
            {SITE_FACTS.contact.phoneDisplay}
          </a>
          .
        </div>
      </noscript>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 flex items-center gap-2.5 cut-tr-sm border border-[#ED1C24]/50 bg-[#ED1C24]/10 p-3.5 text-xs text-white">
          <AlertCircle className="h-4 w-4 text-[#ED1C24] flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Summary Bar when on Step 2 or 3 */}
      {step > 1 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ED1C24]" />
              <span>{activeMeetingConfig.title} ({activeMeetingConfig.minutes}m)</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#ED1C24] hover:underline text-[11px] ml-1"
              >
                [Change]
              </button>
            </span>

            {selectedSlot && (
              <span className="inline-flex items-center gap-1.5 text-[#D1D5DB]">
                <span>·</span>
                <span>{selectedSlot.visitorDateKey}</span>
                <span>at</span>
                <span className="font-semibold text-white">
                  {selectedSlot.visitorTimeFormatted} {selectedSlot.visitorTzAbbr}
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-[#ED1C24] hover:underline text-[11px] ml-1"
                >
                  [Change]
                </button>
              </span>
            )}
          </div>

          <TimezoneSelect value={visitorTz} onChange={setVisitorTz} />
        </div>
      )}

      {/* STEP 1: Meeting Type Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#ED1C24]">
                Step 1 of 3
              </div>
              <h3 className="type-h3 text-white">Select meeting type</h3>
            </div>
            <TimezoneSelect value={visitorTz} onChange={setVisitorTz} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BOOKING_CONFIG.meetingTypes.map((type) => {
              const isSelected = selectedType === type.slug;
              return (
                <button
                  key={type.slug}
                  type="button"
                  onClick={() => {
                    setSelectedType(type.slug);
                    setLiveAnnouncement(`Selected ${type.title}`);
                  }}
                  className={`text-left p-4 cut-tr-sm border transition-all ${
                    isSelected
                      ? "border-[#ED1C24] bg-[#ED1C24]/10 shadow-[0_0_15px_rgba(237,28,36,0.15)]"
                      : "border-white/12 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-semibold text-white text-base">
                      {type.title}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#D1D5DB] font-mono">
                      {type.minutes} min
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex h-11 items-center justify-center gap-2 cut-tr-sm bg-[#C8101A] hover:bg-[#ED1C24] px-6 text-sm font-semibold text-white transition-colors"
            >
              <span>Next: Pick date & time</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Choose Date & Time */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#ED1C24]">
                Step 2 of 3
              </div>
              <h3 className="type-h3 text-white">Choose a date & time</h3>
            </div>
            <TimezoneSelect value={visitorTz} onChange={setVisitorTz} />
          </div>

          {isLoadingSlots ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-xs text-[#9CA3AF]">
              <Loader2 className="h-6 w-6 animate-spin text-[#ED1C24]" />
              <span>Querying verified availability...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Date Picker (7 Cols on desktop) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Desktop Month Calendar */}
                <div className="hidden sm:block cut-tr-sm border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between mb-3 text-sm font-semibold text-white">
                    <span>
                      {currentCalendarMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => {
                          const prev = new Date(currentCalendarMonth);
                          prev.setMonth(prev.getMonth() - 1);
                          setCurrentCalendarMonth(prev);
                        }}
                        className="p-1 rounded hover:bg-white/10 text-[#9CA3AF] hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => {
                          const next = new Date(currentCalendarMonth);
                          next.setMonth(next.getMonth() + 1);
                          setCurrentCalendarMonth(next);
                        }}
                        className="p-1 rounded hover:bg-white/10 text-[#9CA3AF] hover:text-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1 font-mono text-[#6B7280]">
                    <div>Su</div>
                    <div>Mo</div>
                    <div>Tu</div>
                    <div>We</div>
                    <div>Th</div>
                    <div>Fr</div>
                    <div>Sa</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cd, idx) => {
                      if (!cd.isCurrentMonth) {
                        return <div key={idx} className="h-9" />;
                      }
                      const isSelected = selectedDate === cd.dateStr;
                      const hasSlots = cd.hasSlots;

                      return (
                        <button
                          key={cd.dateStr}
                          type="button"
                          disabled={!hasSlots}
                          onClick={() => {
                            setSelectedDate(cd.dateStr);
                            setLiveAnnouncement(`Selected ${cd.dateStr}`);
                          }}
                          className={`h-9 text-xs rounded transition-all flex flex-col items-center justify-center relative ${
                            isSelected
                              ? "bg-[#C8101A] text-white font-bold"
                              : hasSlots
                              ? "text-white hover:bg-white/15 bg-white/[0.04]"
                              : "text-[#4B5563] cursor-not-allowed"
                          }`}
                        >
                          <span>{cd.dayNumber}</span>
                          {hasSlots && !isSelected && (
                            <span className="h-1 w-1 rounded-full bg-[#ED1C24] mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Week Strip */}
                <div className="sm:hidden space-y-2">
                  <div className="text-xs text-[#9CA3AF]">Tap a day with available slots:</div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {mobileDates.map((md) => {
                      const isSelected = selectedDate === md.dateStr;
                      return (
                        <button
                          key={md.dateStr}
                          type="button"
                          disabled={!md.hasSlots}
                          onClick={() => {
                            setSelectedDate(md.dateStr);
                            setLiveAnnouncement(`Selected ${md.dateStr}`);
                          }}
                          className={`flex-shrink-0 w-14 py-2.5 px-1 rounded text-center border transition-all ${
                            isSelected
                              ? "border-[#ED1C24] bg-[#C8101A] text-white font-bold"
                              : md.hasSlots
                              ? "border-white/15 bg-white/[0.04] text-white hover:border-white/30"
                              : "border-white/5 bg-transparent text-[#4B5563] opacity-40 cursor-not-allowed"
                          }`}
                        >
                          <div className="text-[10px] uppercase font-mono">{md.weekday}</div>
                          <div className="text-base font-semibold">{md.dayNum}</div>
                          {md.hasSlots && (
                            <span className="block h-1 w-1 rounded-full bg-[#16A34A] mx-auto mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Time Slot Picker (5 Cols on desktop) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                  <span>Available times in your zone:</span>
                  <span className="text-[#ED1C24] font-medium">
                    {currentDaySlots.length} slot{currentDaySlots.length === 1 ? "" : "s"}
                  </span>
                </div>

                {currentDaySlots.length === 0 ? (
                  <div className="cut-tr-sm border border-white/10 bg-white/[0.02] p-6 text-center text-xs text-[#9CA3AF]">
                    No open times available for this date. Please select another highlighted day.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {currentDaySlots.map((slot) => {
                      const isSelected = selectedSlot?.iso === slot.iso;
                      return (
                        <button
                          key={slot.iso}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleSelectSlot(slot)}
                          className={`p-2.5 cut-tr-sm border text-xs font-semibold transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-[#ED1C24] bg-[#C8101A] text-white"
                              : "border-white/15 bg-white/[0.04] text-white hover:border-white hover:bg-white/[0.08]"
                          }`}
                        >
                          <span className="font-mono">{slot.visitorTimeFormatted}</span>
                          <span className="text-[10px] opacity-70">{slot.visitorTzAbbr}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="pt-2 text-[11px] text-[#9CA3AF] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#ED1C24]" />
                  <span>Two shifts: morning Dubai/Karachi + evening North America</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-[#9CA3AF] hover:text-white"
            >
              ← Back to meeting types
            </button>
            {selectedSlot && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex h-11 items-center justify-center gap-2 cut-tr-sm bg-[#C8101A] hover:bg-[#ED1C24] px-6 text-sm font-semibold text-white transition-colors"
              >
                <span>Continue to details</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Details & Confirmation Form */}
      {step === 3 && (
        <form onSubmit={handleSubmitBooking} className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#ED1C24]">
                Step 3 of 3
              </div>
              <h3 className="type-h3 text-white">Your details</h3>
            </div>
            {selectedSlot && (
              <div className="text-xs text-[#9CA3AF] text-right">
                <div className="font-semibold text-white">
                  {selectedSlot.visitorDateKey} · {selectedSlot.visitorTimeFormatted} {selectedSlot.visitorTzAbbr}
                </div>
                <div>{activeMeetingConfig.title} ({activeMeetingConfig.minutes}m)</div>
              </div>
            )}
          </div>

          {/* Hidden Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp_field_full">Do not fill this</label>
            <input
              type="text"
              id="hp_field_full"
              name="hp_field_full"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                Your Full Name <span className="text-[#ED1C24]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Michael Harris"
                className="w-full bg-[#1A1A1E] border border-white/15 cut-tr-sm px-3.5 py-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#ED1C24]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                Email Address <span className="text-[#ED1C24]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="michael@company.com"
                className="w-full bg-[#1A1A1E] border border-white/15 cut-tr-sm px-3.5 py-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#ED1C24]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                WhatsApp or Phone (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (416) 000-0000"
                className="w-full bg-[#1A1A1E] border border-white/15 cut-tr-sm px-3.5 py-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#ED1C24]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                Company Website (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full bg-[#1A1A1E] border border-white/15 cut-tr-sm px-3.5 py-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#ED1C24]"
              />
            </div>
          </div>

          {/* Service Registry Multi-Select Chips */}
          <div>
            <label className="block text-xs font-medium text-[#D1D5DB] mb-1.5">
              What do you need help with? (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SERVICES_REGISTRY.slice(0, 10).map((srv) => {
                const isSelected = selectedServices.includes(srv.name);
                return (
                  <button
                    key={srv.slug}
                    type="button"
                    onClick={() => toggleService(srv.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-[#C8101A] text-white"
                        : "bg-white/[0.05] text-[#D1D5DB] hover:bg-white/[0.1] hover:text-white border border-white/10"
                    }`}
                  >
                    {srv.shortName}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => toggleService("White-Label Partnership")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedServices.includes("White-Label Partnership")
                    ? "bg-[#C8101A] text-white"
                    : "bg-white/[0.05] text-[#D1D5DB] hover:bg-white/[0.1] hover:text-white border border-white/10"
                }`}
              >
                White-Label Agency
              </button>
            </div>
          </div>

          {/* Monthly Budget Select */}
          <div>
            <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
              Estimated Monthly Budget (Optional)
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-[#1A1A1E] border border-white/15 cut-tr-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ED1C24]"
            >
              <option value="">Select budget range...</option>
              <option value="<$500">&lt;$500 / month (starter task or audit)</option>
              <option value="$500-$1,500">$500 – $1,500 / month (Growth Engine Package)</option>
              <option value="$1,500-$5,000">$1,500 – $5,000 / month (dedicated build or retainer)</option>
              <option value="$5,000+">$5,000+ / month (enterprise or full-stack scaling)</option>
              <option value="one-time">One-time fixed-price build</option>
            </select>
          </div>

          {/* Project Notes */}
          <div>
            <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
              Project Notes or Specific Questions (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell us briefly about your current setup, goals, or deadlines..."
              className="w-full bg-[#1A1A1E] border border-white/15 cut-tr-sm px-3.5 py-2.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#ED1C24]"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-[#9CA3AF] hover:text-white text-left"
            >
              ← Back to date selection
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center gap-2 cut-tr-sm bg-[#C8101A] hover:bg-[#ED1C24] disabled:opacity-60 px-8 text-sm font-semibold text-white transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying & creating Google Meet...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Book Strategy Call</span>
                  <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
