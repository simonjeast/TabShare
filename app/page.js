import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell home-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="TabShare home">
          <span className="brand-mark">↗</span>
          <span>TabShare</span>
        </Link>
        <Link className="primary-button" href="/groups/new">
          Create a group <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <section className="home-intro">
        <p className="eyebrow">Less keeping score. More being together.</p>
        <h1>
          Good times.
          <br />
          Even <span>splits.</span>
        </h1>
        <p className="lead">
          One place for the trip, the house, and everything you share. Add
          expenses, see everyone’s balance, and know who owes what.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" href="/groups/new">
            Start your group <span aria-hidden="true">↗</span>
          </Link>
          <Link className="secondary-button" href="/groups/demo">
            Explore a sample group <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className="helper-text home-note">
          Split in USD · Up to 12 people · No payment transfers
        </p>
      </section>
      <section className="sample-panel" aria-labelledby="sample-title">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">A little less “I’ll work it out later”</p>
            <h2 id="sample-title">The weekend, accounted for.</h2>
          </div>
          <span className="tag">Sample group</span>
        </div>
        <div className="sample-grid">
          <div className="sample-total">
            <p>Coastal weekend</p>
            <strong>$720.00</strong>
            <span>3 friends · 3 shared expenses</span>
            <Link href="/groups/demo">Open sample workspace ↗</Link>
          </div>
          <div className="sample-ledger">
            <div>
              <span>01 / Stay</span>
              <strong>Beach house</strong>
              <b>$480.00</b>
            </div>
            <div>
              <span>02 / Food</span>
              <strong>Saturday dinner</strong>
              <b>$150.00</b>
            </div>
            <div>
              <span>03 / Travel</span>
              <strong>Petrol & parking</strong>
              <b>$90.00</b>
            </div>
          </div>
        </div>
        <div className="sample-bottom">
          <span>
            Alex gets back <strong>$240.00</strong>
          </span>
          <span>Every cent included. Every share clear.</span>
        </div>
      </section>
      <section className="flow-grid home-flow" aria-label="How TabShare works">
        <article>
          <p className="eyebrow">01 / Bring your people</p>
          <h3>Make a group.</h3>
          <p>
            A name and the people sharing the cost. That’s your starting point.
          </p>
        </article>
        <article>
          <p className="eyebrow">02 / Keep it together</p>
          <h3>Add what you paid.</h3>
          <p>Choose who paid and who joined in. We split the expense evenly.</p>
        </article>
        <article>
          <p className="eyebrow">03 / Make it right</p>
          <h3>See how to settle.</h3>
          <p>
            A clear payment plan, calculated to the cent. Pay each other your
            usual way.
          </p>
        </article>
      </section>
      <footer className="site-footer">
        <span>TabShare · Made for shared moments.</span>
        <a href="https://github.com/simonjeast/TabShare">View the project ↗</a>
      </footer>
    </main>
  );
}
