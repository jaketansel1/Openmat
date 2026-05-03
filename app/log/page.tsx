'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const fieldClass =
  'mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:bg-slate-950 focus:ring-4 focus:ring-violet-500/10';

export default function LogPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const date = formData.get('date') as string;
    const type = formData.get('type') as string;
    const duration = Number(formData.get('duration'));
    const intensity = formData.get('intensity') as string;
    const techniques = formData.get('techniques') as string;
    const notes = formData.get('notes') as string;

    const { error } = await supabase.from('sessions').insert({
      date,
      type,
      duration_minutes: duration,
      intensity,
      techniques,
      notes,
    });

    setLoading(false);

    if (error) {
      console.error('Supabase insert error', error);
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage('Session saved!');
    form.reset();
  }

  return (
    <section className="mx-auto w-full max-w-[460px]">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
          Training log
        </p>
        <h1 className="mt-2 text-[2rem] font-bold leading-tight tracking-tight text-white">
          Log your session
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
          Track what you trained, how long you rolled, and what to improve next.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/75 shadow-2xl shadow-black/30 backdrop-blur"
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Training type
            </label>
            <select name="type" className={fieldClass} required>
              <option value="Gi">Gi</option>
              <option value="No Gi">No Gi</option>
              <option value="Open Mat">Open Mat</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Date
              </label>
              <input type="date" name="date" className={fieldClass} required />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Duration
              </label>
              <input
                type="number"
                name="duration"
                min={0}
                placeholder="60"
                className={fieldClass}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Lesson intensity
            </label>
            <select name="intensity" className={fieldClass} required>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Technique practiced
            </label>
            <input
              type="text"
              name="techniques"
              placeholder="Armbar, guard pass, back escape..."
              className={fieldClass}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="What did you work on? How did it go?"
              className={fieldClass + ' resize-none'}
            />
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-white/10 bg-slate-950/80 p-4 backdrop-blur">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(124,58,237,0.35)] transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save session'}
          </button>

          {message && (
            <p className="mt-3 text-center text-sm font-medium text-slate-300">
              {message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
