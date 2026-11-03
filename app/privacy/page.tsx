import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumb, webPage, pageGraph } from "@/lib/schema";
import { contact } from "@/content/facts";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = buildMetadata("privacy");

export default function PrivacyPage() {
  const schema = pageGraph(
    webPage("/privacy/", "Privacy Policy | Haroon Sukhera"),
    breadcrumb([{ name: "Privacy Policy", path: "/privacy/" }])
  );

  return (
    <>
      <JsonLd data={schema} />

      <Section surface="obsidian" className="pb-12 pt-28 md:pt-36">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="t-h1 text-white">Privacy Policy</h1>
            <p className="t-lead mt-4 text-fog">
              How haroonsukhera.com handles the information you send through its forms and optional analytics.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="bone" className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8 text-ink-muted">
            <div>
              <h2 className="t-h3 text-ink">1. Information you send</h2>
              <p className="t-body mt-2">
                When you fill out the contact form or schedule a call, you provide contact details such as your name, email address, WhatsApp number, website URL, and project notes. This information is used strictly to communicate with you regarding your inquiry, evaluate project scope, and provide support.
              </p>
            </div>

            <div>
              <h2 className="t-h3 text-ink">2. Message delivery</h2>
              <p className="t-body mt-2">
                Form submissions are transmitted directly to Haroon Sukhera via secure transactional email. Your information is never sold, leased, rented, or shared with third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="t-h3 text-ink">3. Cookies and analytics</h2>
              <p className="t-body mt-2">
                This website uses essential session functionality to deliver web pages securely. Optional analytics tools (Google Analytics 4 and Microsoft Clarity) are strictly gated and load only if you explicitly choose &ldquo;Accept analytics&rdquo; on the cookie banner. If you choose &ldquo;Essential only&rdquo;, no tracking or analytics scripts will run.
              </p>
            </div>

            <div>
              <h2 className="t-h3 text-ink">4. Third-party integrations</h2>
              <p className="t-body mt-2">
                If you choose to schedule a call via Google Calendar / Google Meet, meeting parameters are coordinated through Google APIs per Google&apos;s standard privacy policies. Cloudflare Turnstile may be used to protect forms against automated spam.
              </p>
            </div>

            <div>
              <h2 className="t-h3 text-ink">5. Contact and data requests</h2>
              <p className="t-body mt-2">
                If you would like to request the deletion or correction of any correspondence you have sent, you can email directly at{" "}
                <a
                  href={contact.emailHref}
                  className="font-semibold text-molten-ink underline underline-offset-2"
                >
                  {contact.email}
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
