'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Session = {
  id: number;
  date: string;
  type: string;
  duration_minutes: number;
};

function minutesToHoursAndMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

export default function StatsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      const { data, error } = await supabase.from('sessions').select('*');

      if (error) console.error(error);
      else setSessions(data as Session[]);

      setLoading(false);
    }

    loadSessions();
  }, []);

  if (loading)
    return (
      <section className="mx-auto flex min-h-[55vh] w-full max-w-[460px] items-center justify-center">
        <div className="rounded-full border border-white/10 bg-slate-900/75 px-4 py-2 text-sm font-medium text-slate-400">
          Loading stats...
        </div>
      </section>
    );

  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));

  const thisWeekSessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return d >= monday;
  });

  const thisWeekMinutes = thisWeekSessions.reduce(
    (sum, s) => sum + (s.duration_minutes || 0),
    0
  );
  const thisWeekCount = thisWeekSessions.length;
  const tw = minutesToHoursAndMinutes(thisWeekMinutes);

  const totalCount = sessions.length;
  const totalMinutes = sessions.reduce(
    (sum, s) => sum + (s.duration_minutes || 0),
    0
  );
  const total = minutesToHoursAndMinutes(totalMinutes);

  const giCount = sessions.filter((s) => s.type === 'Gi').length;
  const noGiCount = sessions.filter((s) => s.type === 'No Gi').length;
  const totalForBar = giCount + noGiCount || 1;

  const giPercentage = (giCount / totalForBar) * 100;
  const noGiPercentage = (noGiCount / totalForBar) * 100;

  return (
    <section className="mx-auto w-full max-w-[460px]">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
          Progress
        </p>
        <h1 className="mt-2 text-[2rem] font-bold leading-tight tracking-tight text-white">
          Stats
        </h1>
      </div>

      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-violet-300/20 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 p-5 text-white shadow-2xl shadow-violet-950/30">
          <div className="absolute right-[-35px] top-[-45px] h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div className="relative">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm font-semibold text-white/80">This week</p>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white shadow-inner">
                Mat time
              </span>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-6xl font-black leading-none tracking-tight">
                  {thisWeekCount}
                </p>
                <p className="mt-2 text-sm font-semibold text-white/80">
                  sessions logged
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black">
                  {tw.hours}h {tw.minutes}m
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  total
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[1.4rem] border border-white/10 bg-slate-900/75 p-4 shadow-xl shadow-black/20">
            <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-500/15 text-sm font-black text-violet-200">
              #
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total sessions
            </p>
            <p className="mt-1 text-3xl font-black tracking-tight text-white">
              {totalCount}
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-slate-900/75 p-4 shadow-xl shadow-black/20">
            <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/15 text-sm font-black text-cyan-200">
              T
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Time trained
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight text-white">
              {total.hours}h {total.minutes}m
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/75 p-4 shadow-xl shadow-black/20">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Training split
              </p>
              <h2 className="mt-1 text-lg font-bold text-white">Gi vs No Gi</h2>
            </div>
            <p className="text-sm font-semibold text-slate-400">
              {giCount + noGiCount} rounds
            </p>
          </div>

          <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-950 p-0.5 ring-1 ring-white/10">
            <div
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
              style={{ width: `${giPercentage}%` }}
            />
            <div
              className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{ width: `${noGiPercentage}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
              <p className="text-xs font-semibold text-violet-200">Gi</p>
              <p className="mt-1 text-xl font-black text-white">{giCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
              <p className="text-xs font-semibold text-cyan-200">No Gi</p>
              <p className="mt-1 text-xl font-black text-white">{noGiCount}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
