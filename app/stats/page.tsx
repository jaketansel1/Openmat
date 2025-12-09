'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Session = {
  id: number;
  date: string; // "YYYY-MM-DD" from Supabase
  type: string;
  duration_minutes: number;
};

function minutesToHoursAndMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

// Helper to get Monday–Sunday range for "this week"
function getWeekRange() {
  const now = new Date();

  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const weekday = now.getDay();
  const diffToMonday = (weekday + 6) % 7; // days since Monday

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - diffToMonday); // move back to Monday

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Sunday
  end.setHours(23, 59, 59, 999);

  return { startOfWeek: start, endOfWeek: end };
}

export default function StatsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      const { data, error } = await supabase
        .from('sessions')
        .select('*');

      if (error) {
        console.error(error);
      } else {
        setSessions(data as Session[]);
      }

      setLoading(false);
    }

    loadSessions();
  }, []);

  if (loading)
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading stats…</p>
      </main>
    );

  // ---- CALCULATIONS ----

  // This week (Mon–Sun) using the `date` column
  const { startOfWeek, endOfWeek } = getWeekRange();

  const thisWeekSessions = sessions.filter((s) => {
    // Supabase `date` column comes as "YYYY-MM-DD"
    // Force it to local midnight so comparisons are consistent
    const d = new Date(`${s.date}T00:00:00`);
    return d >= startOfWeek && d <= endOfWeek;
  });

  const thisWeekMinutes = thisWeekSessions.reduce(
    (sum, s) => sum + (s.duration_minutes || 0),
    0
  );
  const thisWeekCount = thisWeekSessions.length;
  const tw = minutesToHoursAndMinutes(thisWeekMinutes);

  // Lifetime totals
  const totalCount = sessions.length;
  const totalMinutes = sessions.reduce(
    (sum, s) => sum + (s.duration_minutes || 0),
    0
  );
  const total = minutesToHoursAndMinutes(totalMinutes);

  // Gi vs No Gi
  const giCount = sessions.filter((s) => s.type === 'Gi').length;
  const noGiCount = sessions.filter((s) => s.type === 'No Gi').length;
  const totalForBar = giCount + noGiCount || 1;

  const giPercentage = (giCount / totalForBar) * 100;
  const noGiPercentage = (noGiCount / totalForBar) * 100;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-semibold">Session Stats</h1>

        {/* This Week */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-400 rounded-2xl p-5 text-white space-y-1">
          <p className="text-sm opacity-80">This Week</p>
          <p className="text-4xl font-bold">{thisWeekCount}</p>
          <p className="text-sm opacity-80">
            {tw.hours}h {tw.minutes}m total mat time
          </p>
        </div>

        {/* Lifetime totals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Total sessions</p>
            <p className="text-2xl font-semibold">{totalCount}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Total time trained</p>
            <p className="text-xl font-semibold">
              {total.hours}h {total.minutes}m
            </p>
          </div>
        </div>

        {/* Gi vs No Gi bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <p className="text-xs text-slate-400 mb-2">Gi vs No Gi</p>

          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              className="bg-violet-500"
              style={{ width: `${giPercentage}%` }}
            ></div>
            <div
              className="bg-blue-500"
              style={{ width: `${noGiPercentage}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-slate-400">
            <span>🥋 Gi: {giCount}</span>
            <span>🟦 No Gi: {noGiCount}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
