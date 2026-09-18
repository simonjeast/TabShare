import Link from "next/link";
import { CreateGroupForm } from "@/components/CreateGroupForm";
import { isDatabaseConfigured } from "@/lib/db";
export const dynamic = "force-dynamic";
export default function NewGroupPage() {
  const ready = isDatabaseConfigured();
  return (
    <div className="focused-flow">
      <Link className="back-link" href="/">
        ← Your groups
      </Link>
      <header className="flow-heading">
        <p className="eyebrow">Start something together</p>
        <h1>Create a group</h1>
        <p className="muted">A few names. Then you’re ready to split.</p>
      </header>
      <section className="flow-form">
        {!ready ? (
          <div className="banner warning">
            We can’t create groups right now. Please try again later, or{" "}
            <Link href="/groups/demo">explore the sample group</Link>.
          </div>
        ) : null}
        <CreateGroupForm disabled={!ready} />
      </section>
    </div>
  );
}
