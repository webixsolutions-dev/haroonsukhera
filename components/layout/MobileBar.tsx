import Link from "next/link";
import { contact } from "@/content/facts";
import { WhatsAppIcon } from "@/components/ui/SocialIcon";
import { ctaButtons } from "@/content/copy/shared";

/** Glass bottom bar, phones only: "WhatsApp me" · "Send a message". */
export function MobileBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden">
      <div className="glass glass--text pointer-events-auto mx-auto grid max-w-md grid-cols-2 gap-2 rounded-full p-1.5">
        <a
          href={contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--glass min-h-[46px] px-3 text-[15px]"
        >
          <WhatsAppIcon className="h-[18px] w-[18px]" />
          {ctaButtons.whatsapp.label}
        </a>
        <Link href={ctaButtons.message.href} className="btn btn--primary min-h-[46px] px-3 text-[15px]">
          {ctaButtons.message.label}
        </Link>
      </div>
    </div>
  );
}
