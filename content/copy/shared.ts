/** Copy shared by several pages — docs/02-copy.md word for word. */

export type ClientType = "business" | "individual" | "freelancer";

export const doors: {
  type: ClientType;
  title: string;
  body: string;
  button: string;
  image: string;
}[] = [
  {
    type: "business",
    title: "Business",
    body: "Hand over a complete project or a monthly goal: website, store, platform, marketing or automation. One point of contact, a full team behind it.",
    button: "Start a project",
    image: "/images/work-with-me/door-business.webp",
  },
  {
    type: "individual",
    title: "Individual",
    body: "Need one thing done? One page, one fix, one design, one campaign. Small jobs get the same care as big ones.",
    button: "Send your task",
    image: "/images/work-with-me/door-individual.webp",
  },
  {
    type: "freelancer",
    title: "Freelancer or agency",
    body: "Have a client project you can't take on alone? I deliver under your name, stay invisible to your client, work to your deadline and sign an NDA if you need one.",
    button: "Partner with me",
    image: "/images/work-with-me/door-freelancer.webp",
  },
];

export const processSteps = [
  { title: "Tell me what you need", body: "A message, a link to your current site, or a quick call." },
  { title: "Get a clear plan", body: "What will be built, who does what, and when it's ready." },
  { title: "Watch it come together", body: "Written updates as the work moves, so you never have to chase." },
  { title: "Launch and support", body: "Final checks before going live, then help after launch." },
];

export const ctaButtons = {
  message: { label: "Send a message", href: "/contact/" },
  whatsapp: { label: "WhatsApp me" },
};

export const notFoundCopy = {
  h1: "This page doesn't exist",
  body: "The link may be old or mistyped.",
  home: { label: "Go home", href: "/" },
  work: { label: "See my work", href: "/work/" },
};

export const footerCopy = {
  webixLink: "Founder & CEO of Webix Solutions →",
};
