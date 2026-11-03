import { person } from "@/content/facts";

export default function Home() {
  return (
    <main className="container-site section-pad">
      <h1 className="t-h1">
        <span className="t-signature block">{person.name}</span>
        <span className="block">Full-stack developer and founder of Webix Solutions</span>
      </h1>
    </main>
  );
}
