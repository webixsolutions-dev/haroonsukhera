/** FAQ registry. Copy from docs/02-copy.md word for word. All answers render in HTML. */

export type Faq = { q: string; a: string };

export const homeFaq: Faq[] = [
  {
    q: "Who is Haroon Sukhera?",
    a: "Haroon Sukhera is a Pakistani full-stack web developer and the founder and CEO of Webix Solutions, a digital and AI agency. He started as a freelance WordPress developer, has built 150+ websites, and now leads a 20+ person team.",
  },
  {
    q: "What is Webix Solutions?",
    a: "Webix Solutions is the IT company Haroon founded and runs. Its team builds websites and web apps and handles e-commerce, design, video, SEO, paid ads, social media and AI automation for clients in Canada, the US, the UAE, New Zealand and Pakistan.",
  },
  {
    q: "Do you build with code or with WordPress?",
    a: "Both. I write custom platforms in Next.js, React and Node.js, and I build on WordPress, WooCommerce and Shopify when that's the better fit for your team and goals.",
  },
  {
    q: "Can I hire you for one small task?",
    a: "Yes. One page, one fix, one design or one campaign is fine. Send the task and a link, and I'll tell you how I'd handle it.",
  },
  {
    q: "I'm a freelancer or an agency. Can you work under my name?",
    a: "Yes. I deliver white-label: your brand, your client relationship, your deadline. I never contact your client and I'll sign an NDA if you need one.",
  },
  {
    q: "Will I talk to you or to a team?",
    a: "To me. I stay your point of contact from the first message to launch; my team does the parts that need their skills.",
  },
  {
    q: "Which countries do you work with?",
    a: "I have clients in Canada, the United States, the UAE, New Zealand, Pakistan and Palestine, and I've delivered projects with freelance partners for clients in Australia, the UK, Germany and Ecuador.",
  },
  {
    q: "How do we start?",
    a: "Send a message or a WhatsApp with what you need and a link if you have one. If it's easier to talk, book a 20-minute call.",
  },
];

export const servicesFaq: Faq[] = [
  {
    q: "Can I hire you for just one of these services?",
    a: "Yes. Each service can be hired on its own, and a single small task is fine too.",
  },
  {
    q: "Who does the design, video and marketing work?",
    a: "My team at Webix Solutions. I stay your point of contact and check the work before it reaches you.",
  },
  { q: "Do I own the website and code?", a: "Yes. Your files, code and accounts are yours." },
  {
    q: "Can you fix or improve a site someone else built?",
    a: "Yes. Send the link and tell me what's wrong or what you want added.",
  },
  {
    q: "Do you work with clients outside Pakistan?",
    a: "Yes. I have clients in Canada, the US, the UAE, New Zealand, Pakistan and Palestine.",
  },
];

export const contactFaq: Faq[] = [
  {
    q: "What should I send?",
    a: "What you need, a link to your current site if you have one, and when you need it.",
  },
  {
    q: "Can we talk on a call first?",
    a: "Yes. Book a 20-minute call and pick a time in your own time zone.",
  },
  { q: "Do you sign NDAs?", a: "Yes, for freelancers, agencies and any client who needs one." },
];
