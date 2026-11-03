"use client";

import * as React from "react";
import { Globe, Check, ChevronDown } from "lucide-react";

export const COMMON_TIMEZONES = [
  { value: "America/Toronto", label: "Toronto / Montreal (Eastern Time, ET)" },
  { value: "America/New_York", label: "New York / Miami (Eastern Time, ET)" },
  { value: "America/Chicago", label: "Chicago / Houston (Central Time, CT)" },
  { value: "America/Denver", label: "Denver / Phoenix (Mountain Time, MT)" },
  { value: "America/Los_Angeles", label: "Los Angeles / San Francisco (Pacific, PT)" },
  { value: "America/Vancouver", label: "Vancouver / Seattle (Pacific Time, PT)" },
  { value: "Asia/Dubai", label: "Dubai / Abu Dhabi (Gulf Standard Time, GST)" },
  { value: "Asia/Karachi", label: "Pakistan Standard Time (PKT, UTC+5)" },
  { value: "Asia/Riyadh", label: "Riyadh / Saudi Arabia (AST, UTC+3)" },
  { value: "Europe/London", label: "London / United Kingdom (GMT / BST)" },
  { value: "Pacific/Auckland", label: "Auckland / Wellington (NZDT / NZST)" },
  { value: "Australia/Sydney", label: "Sydney / Melbourne (AEDT / AEST)" },
  { value: "Europe/Berlin", label: "Berlin / Frankfurt / Paris (CET / CEST)" },
  { value: "Asia/Singapore", label: "Singapore / Hong Kong (SGT / HKT)" },
];

export interface TimezoneSelectProps {
  value: string;
  onChange: (tz: string) => void;
  className?: string;
}

export function TimezoneSelect({ value, onChange, className = "" }: TimezoneSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel =
    COMMON_TIMEZONES.find((t) => t.value === value)?.label || value;

  const filtered = React.useMemo(() => {
    if (!search.trim()) return COMMON_TIMEZONES;
    const q = search.toLowerCase();
    return COMMON_TIMEZONES.filter(
      (t) => t.label.toLowerCase().includes(q) || t.value.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Change meeting time zone"
        className="flex items-center gap-2 text-xs text-[#9CA3AF] hover:text-white transition-colors py-1 px-2 rounded border border-white/10 hover:border-white/25 bg-white/[0.04]"
      >
        <Globe className="h-3.5 w-3.5 text-[#ED1C24]" />
        <span className="font-medium text-white truncate max-w-[260px] sm:max-w-xs">
          {currentLabel}
        </span>
        <ChevronDown className="h-3 w-3 text-[#9CA3AF]" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-72 sm:w-80 rounded-md border border-white/15 bg-[#121214] shadow-2xl z-50 p-2 text-xs">
          <input
            type="text"
            placeholder="Search city or time zone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1A1E] border border-white/15 rounded px-2.5 py-1.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#ED1C24] mb-1.5"
            autoFocus
          />
          <div className="max-h-56 overflow-y-auto space-y-0.5 divide-y divide-white/5">
            {filtered.length === 0 ? (
              <div className="p-2 text-center text-[#6B7280]">
                No matching time zones
              </div>
            ) : (
              filtered.map((tz) => {
                const isSelected = tz.value === value;
                return (
                  <button
                    key={tz.value}
                    type="button"
                    onClick={() => {
                      onChange(tz.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-xs transition-colors ${
                      isSelected
                        ? "bg-[#ED1C24]/15 text-[#ED1C24] font-medium"
                        : "text-[#D1D5DB] hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className="truncate pr-2">{tz.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
