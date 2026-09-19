import Link from "next/link";
export const metadata = {
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";
export default async function GroupLayout({ children, params }) {
  const { slug } = await params;
  return (
    <>
      {slug === "demo" ? (
        <div className="demo-banner">
          <span>You’re exploring a read-only sample group.</span>
          <Link href="/groups/new">Make it yours →</Link>
        </div>
      ) : null}
      {children}
    </>
  );
}
