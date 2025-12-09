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
    <main className="min-h-screen bg-slate-950 text-slate-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-semibold">Session History</h1>

        {loading && <p className="text-slate-400 text-sm">Loading…</p>}

        {!loading && sessions.length === 0 && (
          <p className="text-slate-400 text-sm">
            No sessions logged yet.
          </p>
        )}

        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2"
            >
              <div className="flex justify-between text-xs text-slate-400">
                <span>{session.date}</span>
                <span>{session.type}</span>
              </div>

              <div className="text-sm font-medium">
                {session.techniques || 'Training session'}
              </div>

              <div className="text-xs text-slate-400">
                {session.duration_minutes ?? 0} mins • {session.intensity}
              </div>

              {session.notes && (
                <p className="text-xs text-slate-300">{session.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
