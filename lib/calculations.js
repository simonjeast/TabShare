export function calculateDerivedState(members, expenses) {
  const balanceMap = new Map(
    members.map((member) => [
      member.id,
      {
        ...member,
        paidCents: 0,
        owedCents: 0,
        balanceCents: 0
      }
    ])
  );

  const categoryMap = new Map();
  let totalSpentCents = 0;
  let largestExpenseCents = 0;

  expenses.forEach((expense) => {
    totalSpentCents += expense.amountCents;
    largestExpenseCents = Math.max(largestExpenseCents, expense.amountCents);
    categoryMap.set(expense.category, (categoryMap.get(expense.category) ?? 0) + expense.amountCents);

    const payer = balanceMap.get(expense.payerId);
    if (payer) {
      payer.paidCents += expense.amountCents;
      payer.balanceCents += expense.amountCents;
    }

    const shares = splitAmountAcrossParticipants(expense.amountCents, expense.participants);
    shares.forEach(({ memberId, shareCents }) => {
      const participant = balanceMap.get(memberId);
      if (!participant) {
        return;
      }

      participant.owedCents += shareCents;
      participant.balanceCents -= shareCents;
    });
  });

  const balances = Array.from(balanceMap.values()).sort((left, right) => right.balanceCents - left.balanceCents);

  const categoryTotals = Array.from(categoryMap.entries())
    .map(([category, amountCents]) => ({
      category,
      amountCents
    }))
    .sort((left, right) => right.amountCents - left.amountCents)
    .map((entry, _index, collection) => ({
      ...entry,
      percent: collection[0] ? Math.max(10, Math.round((entry.amountCents / collection[0].amountCents) * 100)) : 0
    }));

  return {
    balances,
    settlements: calculateSettlements(balances),
    categoryTotals,
    summary: {
      expenseCount: expenses.length,
      totalSpentCents,
      averageExpenseCents: expenses.length ? Math.round(totalSpentCents / expenses.length) : 0,
      largestExpenseCents
    }
  };
}

export function splitAmountAcrossParticipants(amountCents, participants) {
  if (participants.length === 0) {
    return [];
  }

  const baseShare = Math.floor(amountCents / participants.length);
  const remainder = amountCents % participants.length;

  return participants.map((participant, index) => ({
    memberId: participant.id,
    shareCents: baseShare + (index < remainder ? 1 : 0)
  }));
}

export function calculateSettlements(balances) {
  const creditors = balances
    .filter((member) => member.balanceCents > 0)
    .map((member) => ({ ...member }))
    .sort((left, right) => right.balanceCents - left.balanceCents);
  const debtors = balances
    .filter((member) => member.balanceCents < 0)
    .map((member) => ({ ...member, balanceCents: Math.abs(member.balanceCents) }))
    .sort((left, right) => right.balanceCents - left.balanceCents);
  const settlements = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  // AI-assisted first draft, then simplified and checked so the settlement pass stays deterministic in cents.
  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amountCents = Math.min(creditor.balanceCents, debtor.balanceCents);

    settlements.push({
      fromId: debtor.id,
      fromName: debtor.name,
      toId: creditor.id,
      toName: creditor.name,
      amountCents
    });

    creditor.balanceCents -= amountCents;
    debtor.balanceCents -= amountCents;

    if (creditor.balanceCents === 0) {
      creditorIndex += 1;
    }

    if (debtor.balanceCents === 0) {
      debtorIndex += 1;
    }
  }

  return settlements;
}

