# TabShare product flow

Direction: a calm, friendly shared-expense product with plum, lilac, warm ivory and sage. The imagegen concept precedes implementation; the generated board is saved locally as `design/tabshare-flow-v2.png`. The product uses native interface elements, not the mockup as a background.

1. **Your groups:** returning users see groups remembered on this browser, with their balance where a viewing identity is selected. New users have one clear create action, a read-only sample and an invitation-link entry. No invented activity, account profile, settings, or inaccessible navigation.
2. **Create a group:** name the group, enter your own name and friends, optionally add a description. On creation, go straight to the expense list. Remember the creator’s display identity and group link locally.
3. **Group:** expenses are the default view. Show total spending and the selected person’s net balance; retain a clear “Viewing as” control because this is not authenticated identity. Invite people through the capability link. Search/filter expenses and expand a row for participants and notes.
4. **Add expense:** description, large USD amount, payer, and equally split participants. Show exact per-person cent allocations before saving. Keep category, date and notes in optional details. Preserve values on failure.
5. **Balances & settle up:** explain who owes whom. Expand a suggested payment, explicitly confirm it happened outside TabShare, then record it. A database transaction serializes writes and recalculates balances; request IDs make retries idempotent. Keep recorded payments visible separately from expenses.

Private links grant shared access, including payment recording. Local bookmarks are conveniences, not a cloud account. No payment is transferred by TabShare. The prototype intentionally omits misleading navigation or unsupported account capabilities seen in the image concept.

## Simplification pass

Replace the desktop sidebar with a restrained top navigation. Show saved groups as rows with their balances aligned for scanning. Use white space and thin dividers instead of nested colored panels. Keep group creation as the primary home action; reveal invitation entry on demand. Reduce repeated copy, duplicate buttons, decorative avatars, and empty filters. Keep the plum accent for actions and green for positive balances.
