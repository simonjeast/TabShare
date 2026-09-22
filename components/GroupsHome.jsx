"use client";
import Link from "next/link";
import { FlowSteps } from "@/components/FlowSteps";
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
      <FlowSteps step={1} />
      <header className="workspace-heading">
        <div>
          <p className="eyebrow">A place for every shared plan</p>
          <h1>Your groups</h1>
          <p className="muted">Keep the good times. Split the rest.</p>
        </div>
        {groups?.length ? (
          <Link className="primary-button" href="/groups/new">
            + New group
          </Link>
        ) : null}
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
                  {snapshot?.group.purpose ? (
                    <p className="group-purpose">{snapshot.group.purpose}</p>
                  ) : null}
                  {snapshot ? (
                    <div className="card-members">
                      {snapshot.members.map((member) => (
                        <span
                          className="avatar"
                          title={member.name}
                          key={member.id}
                        >
                          {member.name.slice(0, 1)}
                        </span>
                      ))}
                    </div>
                  ) : null}
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
        <Link href="/groups/new" className="new-group-card">
          <span className="new-group-plus">+</span>
          <h2>
            {groups?.length
              ? "Add your next shared adventure"
              : "Your next shared adventure"}
          </h2>
          <p>A trip, a home, or whatever you’re splitting together.</p>
          <span className="secondary-button">Create a group</span>
        </Link>
        {groups?.length === 0 ? (
          <Link href="/groups/demo" className="sample-preview-card">
            <span className="sample-preview-top">EXPLORE THE SAMPLE GROUP <span aria-hidden="true">↗</span></span>
            <span className="sample-preview-art" aria-hidden="true">
              <span className="sample-preview-disc disc-one" />
              <span className="sample-preview-disc disc-two" />
              <span className="sample-preview-disc disc-three" />
            </span>
            <span className="sample-preview-content">
              <span className="sample-preview-kicker">See how it works</span>
              <strong>Coastal weekend</strong>
              <span>Three friends. A shared trip. Everything in its place.</span>
              <span className="sample-preview-link">Explore the group <span aria-hidden="true">→</span></span>
            </span>
          </Link>
        ) : null}
      </section>
      <p className="device-note">
        Groups you open are remembered only in this browser. Keep your
        invitation links to return on another device.
      </p>
      <div className="home-secondary">
        {groups?.length ? (
          <section className="sample-invite">
            <span className="tag">New here?</span>
            <h2>Take a look around.</h2>
            <p>Explore a sample weekend trip, from expenses to who owes what.</p>
            <Link href="/groups/demo" className="text-link">
              Try a sample group →
            </Link>
          </section>
        ) : null}
        <section className="join-group">
          <h2>Have an invitation?</h2>
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
        </section>
      </div>
    </>
  );
}
