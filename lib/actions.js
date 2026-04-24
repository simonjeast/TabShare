"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createExpense, createGroup } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import { expenseInputSchema, groupInputSchema, splitMemberInput } from "@/lib/validation";

export async function createGroupAction(_previousState, formData) {
  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message: "Add a database connection before creating a live workspace."
    };
  }

  const payload = {
    name: String(formData.get("name") ?? ""),
    purpose: String(formData.get("purpose") ?? ""),
    memberNames: splitMemberInput(String(formData.get("members") ?? ""))
  };
  const parsed = groupInputSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the group details and try again."
    };
  }

  let group;

  try {
    group = await createGroup(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: "Unable to create the workspace right now."
    };
  }

  redirect(`/groups/${group.slug}?created=group`);
}

export async function createExpenseAction(_previousState, formData) {
  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message: "Add a database connection before saving expenses."
    };
  }

  const payload = {
    groupSlug: String(formData.get("groupSlug") ?? ""),
    title: String(formData.get("title") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    category: String(formData.get("category") ?? ""),
    amount: Number(formData.get("amount") ?? 0),
    spentOn: String(formData.get("spentOn") ?? ""),
    payerMemberId: String(formData.get("payerMemberId") ?? ""),
    participantIds: formData.getAll("participantIds").map(String)
  };
  const parsed = expenseInputSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the expense details and try again."
    };
  }

  try {
    await createExpense(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message: "Unable to save the expense right now."
    };
  }

  revalidatePath(`/groups/${parsed.data.groupSlug}`);
  revalidatePath(`/groups/${parsed.data.groupSlug}/expenses`);
  revalidatePath(`/groups/${parsed.data.groupSlug}/settlements`);
  redirect(`/groups/${parsed.data.groupSlug}/expenses?created=expense`);
}

