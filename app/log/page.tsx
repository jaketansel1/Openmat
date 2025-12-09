'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LogPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // 👇 Save the form element BEFORE the await
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
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Session saved!');
      form.reset(); // 👈 use saved form, not e.currentTarget
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6">Log your session</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5"
        >
          {/* Training type */}
          <div>
            <label className="block text-sm mb-1">Training type</label>
            <select
              name="type"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
              required
            >
              <option value="Gi">Gi</option>
              <option value="No Gi">No Gi</option>
              <option value="Open Mat">Open Mat</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input
              type="date"
              name="date"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm mb-1">Duration (mins)</label>
            <input
              type="number"
              name="duration"
              min={0}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Intensity */}
          <div>
            <label className="block text-sm mb-1">Lesson intensity</label>
            <select
              name="intensity"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Techniques */}
          <div>
            <label className="block text-sm mb-1">Technique practised</label>
            <input
              type="text"
              name="techniques"
              placeholder="Armbar, heel hook..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="What did you work on? How did it go?"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 text-sm font-semibold"
          >
            {loading ? 'Saving…' : 'Submit'}
          </button>

          {message && (
            <p className="text-sm mt-2 text-center">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}
