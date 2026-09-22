"use server";

import { InputError } from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createExpense, createGroup, recordPayment } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import {
  expenseInputSchema,
  paymentInputSchema,
  groupInputSchema,
  splitMemberInput,
} from "@/lib/validation";

export async function createGroupAction(_previousState, formData) {
  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message: "Add a database connection before creating a live workspace.",
    };
  }

  const payload = {
    name: String(formData.get("name") ?? ""),
    purpose: String(formData.get("purpose") ?? ""),
    memberNames: [
      String(formData.get("yourName") ?? "").trim(),
      ...splitMemberInput(String(formData.get("members") ?? "")),
    ],
  };
  const parsed = groupInputSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Check the group details and try again.",
    };
  }

  let group;

  try {
    group = await createGroup(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof InputError
          ? error.message
          : "Unable to create the workspace right now.",
    };
  }

  redirect(`/groups/${group.slug}?created=group&as=${group.firstMemberId}`);
}

export async function createExpenseAction(_previousState, formData) {
  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message: "Add a database connection before saving expenses.",
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
    participantIds: formData.getAll("participantIds").map(String),
  };
  const parsed = expenseInputSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Check the expense details and try again.",
    };
  }

  try {
    await createExpense(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof InputError
          ? error.message
          : "Unable to save the expense right now.",
    };
  }

  revalidatePath(`/groups/${parsed.data.groupSlug}`);
  revalidatePath(`/groups/${parsed.data.groupSlug}/expenses`);
  revalidatePath(`/groups/${parsed.data.groupSlug}/settlements`);
  redirect(`/groups/${parsed.data.groupSlug}/settlements?created=expense`);
}

export async function recordPaymentAction(_previousState, formData) {
  const parsed = paymentInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the payment details.",
    };
  try {
    await recordPayment(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof InputError
          ? error.message
          : "We couldn’t record this payment. Try again.",
    };
  }
  revalidatePath(`/groups/${parsed.data.groupSlug}`, "layout");
  redirect(`/groups/${parsed.data.groupSlug}/settlements?created=payment`);
}
