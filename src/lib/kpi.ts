import { supabase } from './supabase';

export async function getUserSeries(kind: string, granularity: 'daily'|'monthly'|'quarterly', from: string, to: string) {
  const { data: u } = await supabase.auth.getUser();
  const uid = (u && u.user && u.user.id) as string;
  const fn = granularity === 'daily' ? 'kpi_user_timeseries' : granularity === 'monthly' ? 'kpi_user_monthly' : 'kpi_user_quarterly';
  const { data, error } = await supabase.rpc(fn, { u: uid, start_date: from, end_date: to, start_month: from, end_month: to, start_q: from, end_q: to, kind });
  if (error) throw error;
  return data as { d: string; amount: number }[];
}

export async function getGroupSeries(groupId: string, kind: string, from: string, to: string) {
  const { data, error } = await supabase.rpc('kpi_group_aggregate', { g: groupId, start_date: from, end_date: to, kind });
  if (error) throw error;
  return data as { d: string; amount: number }[];
}
