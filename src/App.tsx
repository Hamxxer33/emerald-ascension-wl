import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { BRAND, STORAGE_KEY, TASKS } from "./config";
import "./App.css";

type WlEntry = {
  robinhood: string;
  xHandle: string;
  tasks: Record<string, boolean>;
  submittedAt: string;
};

function loadEntry(): WlEntry | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WlEntry;
  } catch {
    return null;
  }
}

function saveEntry(entry: WlEntry) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default function App() {
  const existing = useMemo(() => loadEntry(), []);
  const [doneTasks, setDoneTasks] = useState<Record<string, boolean>>(
    () => existing?.tasks ?? {},
  );
  const [robinhood, setRobinhood] = useState(existing?.robinhood ?? "");
  const [xHandle, setXHandle] = useState(existing?.xHandle ?? "");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(Boolean(existing));

  useEffect(() => {
    document.title = `${BRAND.name} — Whitelist`;
  }, []);

  const requiredReady = TASKS.filter((t) => t.required).every(
    (t) => doneTasks[t.id],
  );

  function toggleTask(id: string, url: string) {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    setDoneTasks((prev) => ({ ...prev, [id]: true }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!requiredReady) {
      setError("Complete the required tasks first.");
      return;
    }
    const trimmed = robinhood.trim();
    if (!trimmed) {
      setError("Enter your Robinhood wallet.");
      return;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      setError("That doesn't look like a Robinhood wallet. Use the 0x address.");
      return;
    }

    const entry: WlEntry = {
      robinhood: trimmed,
      xHandle: xHandle.trim().replace(/^@/, ""),
      tasks: { ...doneTasks },
      submittedAt: new Date().toISOString(),
    };
    saveEntry(entry);
    setError("");
    setSubmitted(true);
  }

  function resetForm() {
    localStorage.removeItem(STORAGE_KEY);
    setSubmitted(false);
    setRobinhood("");
    setXHandle("");
    setDoneTasks({});
    setError("");
  }

  return (
    <div className="page">
      <div className="glow glow-lime" aria-hidden="true" />
      <div className="glow glow-gold" aria-hidden="true" />

      <main className="shell">
        <section className="hero glass">
          <div className="banner-wrap">
            <img
              src={BRAND.banner}
              alt="Emerald Ascension banner"
              className="banner"
            />
            <div className="banner-fade" />
          </div>

          <div className="hero-body">
            <img
              src={BRAND.avatar}
              alt="Emerald Ascension avatar"
              className="avatar"
              width={96}
              height={96}
            />

            <div className="hero-copy">
              <p className="eyebrow">Whitelist</p>
              <h1>{BRAND.name}</h1>
              <a
                className="handle"
                href={BRAND.xUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <XIcon className="icon-sm" />
                {BRAND.handle}
              </a>
              <p className="bio">{BRAND.bio}</p>
            </div>
          </div>
        </section>

        {submitted ? (
          <section className="card glass success-card">
            <div className="success-badge">
              <CheckIcon className="icon-md" />
            </div>
            <h2>You&apos;re on the list</h2>
            <p className="muted">
              You&apos;re locked for 2222 Emerald on Robinhood. Keep following{" "}
              <a href={BRAND.xUrl} target="_blank" rel="noopener noreferrer">
                {BRAND.handle}
              </a>{" "}
              for drops.
            </p>
            <dl className="meta">
              <div>
                <dt>Robinhood wallet</dt>
                <dd>{robinhood}</dd>
              </div>
              {xHandle ? (
                <div>
                  <dt>X</dt>
                  <dd>@{xHandle.replace(/^@/, "")}</dd>
                </div>
              ) : null}
            </dl>
            <button type="button" className="btn ghost" onClick={resetForm}>
              Submit another
            </button>
          </section>
        ) : (
          <>
            <section className="card glass">
              <div className="card-head">
                <p className="step">1 · Tasks</p>
                <h2>Complete required tasks</h2>
                <p className="muted">
                  Tap a task to open it, then it marks complete. Profile link
                  until a status post is live.
                </p>
              </div>

              <ul className="tasks">
                {TASKS.map((task) => {
                  const on = Boolean(doneTasks[task.id]);
                  return (
                    <li key={task.id} className="task-row">
                      <button
                        type="button"
                        className={`task-btn${on ? " on" : ""}`}
                        onClick={() => toggleTask(task.id, task.url)}
                      >
                        <span className={`check${on ? " on" : ""}`}>
                          {on ? (
                            <CheckIcon className="icon-xs" />
                          ) : (
                            <span className="dot" />
                          )}
                        </span>
                        <span className="task-label">
                          {task.label}
                          {task.required ? (
                            <span className="req">Required</span>
                          ) : null}
                        </span>
                      </button>
                      <a
                        className="task-ext"
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${task.label}`}
                      >
                        <ExternalIcon className="icon-sm" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section
              className={`card glass form-card${requiredReady ? "" : " locked"}`}
            >
              <div className="card-head">
                <p className="step">2 · Whitelist</p>
                <h2>Join the whitelist</h2>
                <p className="muted">
                  {requiredReady
                    ? "Drop your Robinhood wallet. X handle is optional."
                    : "Finish the tasks above to unlock the form."}
                </p>
              </div>

              <form className="form" onSubmit={onSubmit}>
                <label className="field">
                  <span>Robinhood wallet</span>
                  <input
                    value={robinhood}
                    onChange={(e) => setRobinhood(e.target.value)}
                    placeholder="0x…"
                    autoComplete="off"
                    spellCheck={false}
                    disabled={!requiredReady}
                  />
                </label>

                <label className="field">
                  <span>
                    X handle <em>(optional)</em>
                  </span>
                  <input
                    value={xHandle}
                    onChange={(e) => setXHandle(e.target.value)}
                    placeholder="@yourhandle"
                    autoComplete="off"
                    spellCheck={false}
                    disabled={!requiredReady}
                  />
                </label>

                {error ? <p className="error">{error}</p> : null}

                <button
                  type="submit"
                  className="btn primary"
                  disabled={!requiredReady}
                >
                  {requiredReady ? "Submit whitelist" : "Complete tasks to unlock"}
                </button>
              </form>
            </section>
          </>
        )}

        <footer className="footer">
          <a
            href={BRAND.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <XIcon className="icon-sm" />
            {BRAND.handle}
          </a>
          <span className="footer-sep">·</span>
          <span className="footer-note">2222 Emerald</span>
        </footer>
      </main>
    </div>
  );
}
