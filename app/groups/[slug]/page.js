import { notFound } from "next/navigation";
import { getGroupSnapshot } from "@/lib/data";
import { GroupWorkspace } from "@/components/GroupWorkspace";
export const dynamic = "force-dynamic";
export default async function GroupPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const snapshot = await getGroupSnapshot(slug);
  if (!snapshot) notFound();
  return (
    <GroupWorkspace
      snapshot={snapshot}
      created={query.created}
      initialMemberId={query.as}
    />
  );
}
