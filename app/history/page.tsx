'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Session = {
  id: number;
  date: string;
  type: string;
  duration_minutes: number | null;
  intensity: string | null;
  techniques: string | null;
  notes: string | null;
};

function intensityClass(intensity: string | null) {
  if (intensity === 'High') return 'border-rose-400/25 bg-rose-500/10 text-rose-200';
  if (intensity === 'Medium') return 'border-amber-400/25 bg-amber-500/10 text-amber-200';
  return 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200';
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false });

      if (error) console.error(error);
      else setSessions(data as Session[]);

      setLoading(false);
    }

    loadSessions();
  }, []);

  return (
    <section className="mx-auto w-full max-w-[460px]">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            Review
          </p>
          <h1 className="mt-2 text-[2rem] font-bold leading-tight tracking-tight text-white">
            History
          </h1>
        </div>
        <p className="pb-1 text-sm font-medium text-slate-400">
          {sessions.length} sessions
        </p>
      </div>

      {loading && (
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
          Loading sessions...
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="rounded-[1.75rem] border border-dashed border-violet-400/30 bg-slate-900/60 p-6 text-center shadow-2xl shadow-black/20">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200">
            <span className="text-lg font-bold">+</span>
          </div>
          <h2 className="text-lg font-semibold text-white">No sessions yet</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Log your first class or open mat and it will show up here.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((session) => (
          <article
            key={session.id}
            className="rounded-[1.5rem] border border-white/10 bg-slate-900/75 p-4 shadow-xl shadow-black/20 transition hover:border-violet-300/20 hover:bg-slate-900 active:scale-[0.995]"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {formatDate(session.date)}
                </p>
                <h2 className="mt-1 text-base font-bold leading-snug text-white">
                  {session.techniques || 'Training session'}
                </h2>
              </div>

              <span className="shrink-0 rounded-full border border-violet-300/25 bg-violet-500/10 px-2.5 py-1 text-xs font-bold text-violet-200">
                {session.type || 'BJJ'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-slate-950/55 px-2.5 py-1 text-xs font-semibold text-slate-300">
                {session.duration_minutes ?? 0} min
              </span>
              <span
                className={[
                  'rounded-full border px-2.5 py-1 text-xs font-semibold',
                  intensityClass(session.intensity),
                ].join(' ')}
              >
                {session.intensity || 'Low'} intensity
              </span>
            </div>

            {session.notes && (
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-slate-400">
                {session.notes}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
