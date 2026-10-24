import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Feather, X, ChevronRight, ArrowDown, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Рабочее место — Falcon Work" },
      { name: "description", content: "Проекты, демо-стенды и терминал в одном окне Falcon Work." },
      { property: "og:title", content: "Рабочее место — Falcon Work" },
      { property: "og:description", content: "Проекты, демо-стенды и терминал в одном окне Falcon Work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const tabs = ["Рабочее место", "Мои чаты", "Задачи", "Созвоны", "Выкатка"];
const listening = [
  { label: "3200 docker-proxy, уже открыт", disabled: true },
  { label: "3320 next-server (v1)" },
  { label: "5433 docker-proxy, localhost" },
  { label: "36707 claude, localhost" },
];

type Stand = { id: number; host: string; name: string; port: string };

function Index() {
  const [tab, setTab] = useState(tabs[0]);
  const [stands, setStands] = useState<Stand[]>([
    { id: 1, host: "s20014.80-209-241-180.sslip.io", name: "Nasib v2", port: "3200" },
  ]);
  const [port, setPort] = useState("");
  const [name, setName] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [cmd, setCmd] = useState("");
  const [atBottom, setAtBottom] = useState(true);
  const outRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => outRef.current?.scrollTo({ top: outRef.current.scrollHeight, behavior: "smooth" });
  useEffect(() => { if (atBottom) scrollBottom(); }, [lines]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.ctrlKey && e.key === "End") scrollBottom(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const openStand = () => {
    if (!/^\d+$/.test(port)) return;
    setStands((s) => [...s, { id: Date.now(), host: `s${port}${Date.now() % 1000}.80-209-241-180.sslip.io`, name: name || "Стенд", port }]);
    setPort(""); setName("");
  };

  return (
    <div className="flex h-screen flex-col bg-background font-sans text-foreground">
      <header className="flex h-16 shrink-0 items-center gap-6 border-b bg-card px-5">
        <div className="flex items-center gap-2 text-lg font-semibold"><Feather className="h-5 w-5 text-primary" />Falcon Work</div>
        <nav className="flex gap-1">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-md px-3 py-2 text-[15px] transition-colors ${tab === t ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </nav>
        <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">AN</div>
      </header>

      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto">
          <section className="rounded-xl border bg-card p-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-medium">Проекты</h2>
              <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Новый проект</button>
            </div>
            <div className="rounded-lg bg-accent px-3 py-2">
              <div>nasib</div>
              <div className="text-xs text-muted-foreground">FalconAI-team/nasib</div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-3 text-sm">
            <h2 className="mb-3 font-medium">Демо-стенды</h2>
            {stands.map((s) => (
              <div key={s.id} className="mb-3 flex gap-2 border-b pb-3">
                <div className="min-w-0 flex-1">
                  <a href={`https://${s.host}`} target="_blank" rel="noreferrer" className="break-all font-mono text-primary underline">{s.host}</a>
                  <div className="text-muted-foreground">{s.name}, порт {s.port} в контейнере, <span className="inline-block h-2 w-2 rounded-full bg-success" /> работает</div>
                </div>
                <button aria-label="Закрыть стенд" onClick={() => setStands((x) => x.filter((y) => y.id !== s.id))} className="self-start text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
            ))}
            <input value={port} onChange={(e) => setPort(e.target.value)} placeholder="Порт, например 3000" className="mb-2 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название (необязательно)" className="mb-2 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40" />
            <button onClick={openStand} className="w-full rounded-md bg-primary py-2 font-medium text-primary-foreground hover:bg-primary/90">Открыть наружу</button>
            <div className="mt-3 text-muted-foreground">Сейчас слушают:</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {listening.map((l) => (
                <button key={l.label} disabled={l.disabled} onClick={() => setPort(l.label.split(" ")[0] ?? "")}
                  className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-foreground/80 hover:bg-accent disabled:opacity-40">{l.label}</button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Запустите приложение в терминале и откройте его порт — получите адрес для показа. Приложение должно слушать 0.0.0.0, а не localhost.</p>
          </section>
        </aside>

        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-terminal text-terminal-foreground">
          <div className="flex items-center gap-3 border-b border-terminal-border px-4 py-3">
            <span className="font-semibold">nasib</span>
            <span className="text-terminal-muted">FalconAI-team/nasib</span>
            <div className="ml-auto flex items-center gap-3 text-sm">
              <span className="flex items-center gap-2 text-terminal-muted"><span className="h-2 w-2 rounded-full bg-success" />подключено</span>
              <button className="rounded-md border border-terminal-border px-3 py-1.5 hover:bg-terminal-raised">Пригласить</button>
              <button className="rounded-md border border-terminal-border px-3 py-1.5 hover:bg-terminal-raised">Удалить</button>
            </div>
          </div>

          <div ref={outRef} onScroll={(e) => { const t = e.currentTarget; setAtBottom(t.scrollHeight - t.scrollTop - t.clientHeight < 20); }}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-3 font-mono text-sm leading-6">
            {lines.map((l, i) => (
              <div key={i} className="flex gap-2 bg-terminal-raised/60 px-1"><ChevronRight className="mt-1 h-4 w-4 text-terminal-muted" />{l}</div>
            ))}
          </div>

          {!atBottom && (
            <button onClick={scrollBottom} className="absolute bottom-28 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded bg-terminal-raised px-3 py-1 font-mono text-sm hover:bg-terminal-border">
              Jump to bottom (Ctrl+End) <ArrowDown className="h-4 w-4" />
            </button>
          )}

          <div className="flex justify-end px-4 pb-1 font-mono text-sm text-success"><Check className="mr-1 mt-0.5 h-4 w-4" />Update installed</div>
          <form onSubmit={(e) => { e.preventDefault(); if (cmd.trim()) { setLines((l) => [...l, cmd]); setCmd(""); } }}
            className="mx-4 flex items-center gap-2 border-y border-terminal-border py-3 font-mono">
            <ChevronRight className="h-4 w-4 text-terminal-muted" />
            <input value={cmd} onChange={(e) => setCmd(e.target.value)} aria-label="Команда" className="flex-1 bg-transparent text-sm outline-none" />
          </form>
          <div className="px-6 py-2 font-mono text-sm text-terminal-muted">
            <span className="text-chart-4">▸▸ auto mode on</span> · <span className="text-terminal-accent">1 shell</span> · ↓ to manage
          </div>
        </main>
      </div>
    </div>
  );
}
