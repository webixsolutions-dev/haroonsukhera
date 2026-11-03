/** ABOUT copy — docs/02-copy.md word for word. */

export const aboutCopy = {
  h1: "About Haroon Sukhera",
  answer:
    "I'm a full-stack web developer from Punjab, Pakistan, and the founder and CEO of Webix Solutions. I've built 150+ websites and now lead a 20+ person team that designs, builds and markets for clients in Canada, the US, the UAE, New Zealand, Pakistan and Palestine.",
  story: {
    h2: "How I got here",
    paragraphs: [
      "I started where a lot of developers start — building WordPress sites for clients I met online. One site became ten, ten became a hundred, and every project taught me something about what makes a website actually work for a business.",
      "As the projects got bigger, I moved into custom code: Next.js, React and Node.js platforms with their own back ends, dashboards and admin panels. I kept the WordPress and Shopify skills, because many clients still need exactly that.",
      "Clients kept asking for more than a website — logos, social posts, ads, videos, automation. So I built a team. That team became Webix Solutions, and today it's more than 20 people. I still lead the work myself.",
    ],
  },
  now: {
    h2: "What I do now",
    body: "I build and lead. I write and review code, plan projects with clients, and make sure what my team delivers is what we promised.",
    chips: ["Custom platforms", "WordPress & Shopify", "Team of 20+"],
  },
  how: {
    h2: "How I work",
    principles: [
      { title: "You talk to me.", body: "One point of contact from the first message to launch." },
      { title: "Plain updates.", body: "Written progress as the work moves — no chasing." },
      {
        title: "The right tool, not the fanciest.",
        body: "Custom code when you need it, WordPress or Shopify when that's smarter.",
      },
      { title: "Your work stays yours.", body: "Your files, your accounts, your client relationships." },
    ],
  },
  education: {
    h2: "Education",
    line: "Bachelor of Computer Science (BCompSc), Islamia University Bahawalpur.",
  },
  bio: {
    h2: "Official bio",
    shortLabel: "Short",
    mediumLabel: "Medium",
    copy: "Copy bio",
    download: "Download photo",
  },
  online: {
    h2: "Find me online",
  },
} as const;
