import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function ReportWork() {
  const [kpi, setKpi] = useState('impressions');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  async function save() {
    setStatus('saving');
    const { data: u } = await supabase.auth.getUser();
    const uid = (u && u.user && u.user.id) || null;
    if (!uid) { setStatus('error'); return; }

    const { data: memberships } = await supabase.from('group_members').select('group_id').eq('user_id', uid).limit(1);
    const groupId = memberships && memberships[0] && (memberships[0] as any).group_id;

    const { error } = await supabase.from('work_logs').insert({
      user_id: uid,
      group_id: groupId,
      kpi,
      amount: Number(amount),
      occurred_on: date,
      note
    });
    setStatus(error ? 'error' : 'saved');
  }

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <h3 className="font-semibold">Report Work</h3>
      <div className="grid grid-cols-2 gap-3">
        <select value={kpi} onChange={e=>setKpi(e.target.value)} className="border rounded p-2">
          <option value="impressions">Impressions</option>
          <option value="orders">Orders</option>
          <option value="setups">Setups</option>
          <option value="downtime_minutes">Downtime (min)</option>
        </select>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="border rounded p-2" />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded p-2 col-span-2 md:col-span-1" />
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Note (optional)" className="border rounded p-2 col-span-2" />
      </div>
      <button onClick={save} className="px-3 py-2 rounded bg-black text-white">
        {status==='saving' ? 'Saving…' : 'Save'}
      </button>
      {status==='saved' && <div className="text-green-600">Saved!</div>}
      {status==='error' && <div className="text-red-600">Something went wrong.</div>}
    </div>
  );
}
