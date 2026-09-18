import { redirect } from "next/navigation";
export default async function ExpensesPage({ params }) {
  const { slug } = await params;
  redirect(`/groups/${slug}`);
}
