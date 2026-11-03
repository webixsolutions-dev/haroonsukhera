"use client";

import { useState } from "react";
import { Calendar, Clock, Video, Mail, MessageSquare } from "lucide-react";
import { contact } from "@/content/facts";
import { Glass } from "@/components/glass/Glass";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/SocialIcon";

export function BookingWidget() {
  const [selectedTz, setSelectedTz] = useState(
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"
  );

  return (
    <div id="booking-section">
      <Glass variant="text" className="p-6 md:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-molten/30 bg-molten/10 px-3 py-1 text-xs font-semibold text-molten-soft">
              <Clock size={14} /> 20-minute call with Haroon
            </div>
            <h3 className="t-h3 mt-3 text-white">Schedule a 20-minute call</h3>
            <p className="t-body mt-2 text-fog">
              Pick a time in your own time zone for a direct introductory conversation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-fog">
            <span>Your time zone:</span>
            <span className="font-mono text-white/90 font-medium">{selectedTz}</span>
          </div>
        </div>

        {/* Live Calendar Call Card */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <Video className="mt-1 shrink-0 text-molten" size={20} />
              <div>
                <strong className="block text-sm text-white">Google Meet</strong>
                <span className="text-xs text-fog">Video call with Haroon</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-1 shrink-0 text-molten" size={20} />
              <div>
                <strong className="block text-sm text-white">20 Minutes</strong>
                <span className="text-xs text-fog">Focused scoping & discussion</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="mt-1 shrink-0 text-molten" size={20} />
              <div>
                <strong className="block text-sm text-white">Direct Confirmation</strong>
                <span className="text-xs text-fog">Instant calendar invitation</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm text-fog leading-relaxed">
              To reserve a slot directly with Haroon, send a brief message or WhatsApp with your preferred day and time.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                href={contact.whatsappHref}
                variant="primary"
                external
                className="gap-2"
              >
                <WhatsAppIcon className="h-4 w-4" /> Book via WhatsApp
              </Button>
              <Button
                href={`${contact.emailHref}?subject=Schedule%20a%2020-minute%20call`}
                variant="glass"
                className="gap-2"
              >
                <Mail size={16} /> Book via Email
              </Button>
            </div>
          </div>
        </div>
      </Glass>
    </div>
  );
}
