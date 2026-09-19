"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readSavedGroups, forgetGroup } from "@/lib/saved-groups";
import { formatCurrencyFromCents as money } from "@/lib/formatting";
export function GroupsHome() {
  const [groups, setGroups] = useState(null);
  const [invitation, setInvitation] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const saved = readSavedGroups();
    Promise.all(
      saved.map(async (item) => {
        try {
          const response = await fetch(`/api/groups/${item.slug}`);
          if (!response.ok) return { ...item, unavailable: true };
          return { ...item, snapshot: await response.json() };
        } catch {
          return { ...item, unavailable: true };
        }
      }),
    ).then((items) => {
      if (active) setGroups(items);
    });
    return () => {
      active = false;
    };
  }, []);
  function openInvitation(event) {
    event.preventDefault();
    try {
      const url = new URL(invitation, window.location.origin);
      const match = url.pathname.match(/^\/groups\/(g-[A-Za-z0-9_-]{32})\/?$/);
      if (!match) throw new Error();
      window.location.assign(`/groups/${match[1]}`);
    } catch {
      setError("Paste the full invitation link you received.");
    }
  }
  return (
    <>
      <header className="workspace-heading">
        <div>
          <h1>Your groups</h1>
          <p className="muted">Shared expenses. All in one place.</p>
        </div>
        <Link className="primary-button" href="/groups/new">
          + New group
        </Link>
      </header>
      <section className="groups-grid" aria-label="Your saved groups">
        {groups === null ? (
          <div className="group-card">Loading your groups…</div>
        ) : (
          groups.map((item) => {
            const snapshot = item.snapshot;
            const person = snapshot?.balances.find(
              (member) => member.id === item.memberId,
            );
            return (
              <article className="group-card" key={item.slug}>
                <Link href={`/groups/${item.slug}`} className="group-card-link">
                  <div className="group-card-heading">
                    <span className="group-initial">
                      {(snapshot?.group.name || item.name || "G")
                        .slice(0, 1)
                        .toUpperCase()}
                    </span>
                    <div>
                      <h2>{snapshot?.group.name || item.name}</h2>
                      <p>
                        {snapshot
                          ? `${snapshot.members.length} people${person ? ` · Viewing as ${person.name}` : ""}`
                          : "Currently unavailable"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`group-balance ${person?.balanceCents < 0 ? "owed" : ""}`}
                  >
                    <span>
                      {person
                        ? person.balanceCents > 0
                          ? "You get back"
                          : person.balanceCents < 0
                            ? "You owe"
                            : "All settled up"
                        : snapshot
                          ? "Total shared expenses"
                          : "Try opening the group again"}
                    </span>
                    {snapshot ? (
                      <strong>
                        {money(
                          person
                            ? Math.abs(person.balanceCents)
                            : snapshot.summary.totalSpentCents,
                        )}
                      </strong>
                    ) : null}
                  </div>
                  <div className="card-bottom">
                    <span>
                      {snapshot
                        ? `${snapshot.summary.expenseCount} expense${snapshot.summary.expenseCount === 1 ? "" : "s"}`
                        : "Your saved link is still here"}
                    </span>
                    <strong>View group →</strong>
                  </div>
                </Link>
                <button
                  className="text-button muted"
                  onClick={() => {
                    if (forgetGroup(item.slug))
                      setGroups((previous) =>
                        previous.filter((group) => group.slug !== item.slug),
                      );
                    else setError("This browser can’t update saved groups.");
                  }}
                >
                  Remove from this device
                </button>
              </article>
            );
          })
        )}
        {groups?.length === 0 ? (
          <Link href="/groups/new" className="new-group-card">
            <span className="new-group-plus">+</span>
            <h2>Split something together.</h2>
            <p>A weekend away, your flatmates, or dinner with friends.</p>
            <span className="secondary-button">Create a group</span>
          </Link>
        ) : null}
      </section>
      <p className="device-note">
        Saved on this device. Keep your group links to open them elsewhere.
      </p>
      <details className="join-group">
        <summary>
          Join with an invitation link <span>+</span>
        </summary>
        <form onSubmit={openInvitation}>
          <label htmlFor="invitation">Paste your group link</label>
          <div className="join-input">
            <input
              className="input"
              id="invitation"
              type="text"
              value={invitation}
              onChange={(event) => setInvitation(event.target.value)}
              placeholder="https://…/groups/…"
              required
            />
            <button className="secondary-button" type="submit">
              Open →
            </button>
          </div>
        </form>
        <p className="feedback error" role="status">
          {error}
        </p>
      </details>
    </>
  );
}
