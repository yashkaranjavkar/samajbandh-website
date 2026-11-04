import React, { useEffect, useMemo, useState } from 'react';
import { CalendarClock, FileText, Mail, Paperclip, RefreshCw, Send, Users, X } from 'lucide-react';
import { ApiService } from '../../services/api';

type CampaignStatus = 'draft' | 'scheduled' | 'processing' | 'sent' | 'partially_sent' | 'failed' | 'cancelled';
type Attachment = { storedName: string; filename: string; size: number; mimeType: string };
type Campaign = {
  attachments?: Attachment[];
  id: string; subject: string; html?: string; content: string; status: CampaignStatus;
  scheduledAt?: string | null; recipientCount?: number; sentCount?: number; failedCount?: number; createdAt: string;
};
type SubscriberStats = { total: number; active: number };

const inputClass = 'w-full rounded-xl border border-[#E5DFC5] bg-[#FBF9F5] px-3.5 py-3 text-sm text-[#1F2421] outline-none focus:ring-2 focus:ring-[#143D2B]';
const buttonPrimary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#143D2B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1d523b] disabled:cursor-not-allowed disabled:opacity-50';
const buttonSecondary = 'inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5DFC5] bg-white px-4 py-2.5 text-xs font-bold text-[#143D2B] hover:bg-[#FBF9F5] disabled:opacity-50';

export const NewsletterCampaigns: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<SubscriberStats>({ total: 0, active: 0 });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);

  const MAX_FILES = 5;
  const MAX_FILE_BYTES = 5 * 1024 * 1024;
  const formatSize = (bytes: number) => bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

  const addFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setError(''); setMessage('');
    if (attachments.length + files.length > MAX_FILES) { setError(`You can attach at most ${MAX_FILES} files.`); return; }
    const tooBig = files.find(f => f.size > MAX_FILE_BYTES);
    if (tooBig) { setError(`"${tooBig.name}" is larger than 5 MB.`); return; }
    setUploading(true);
    try {
      const uploaded: Attachment[] = [];
      for (const file of files) uploaded.push(await ApiService.uploadFile('newsletter-attachment', file));
      setAttachments(current => [...current, ...uploaded]);
    } catch (e: any) { setError(e?.message || 'File upload failed.'); }
    finally { setUploading(false); }
  };
  const removeAttachment = (storedName: string) => setAttachments(current => current.filter(a => a.storedName !== storedName));

  const refresh = async () => {
    setLoading(true); setError('');
    try {
      const [campaignResult, subscriberResult] = await Promise.all([
        ApiService.getNewsletterCampaigns(), ApiService.getNewsletterSubscribers()
      ]);
      setCampaigns(campaignResult || []);
      setStats(subscriberResult?.stats || { total: subscriberResult?.data?.length || 0, active: subscriberResult?.data?.filter((s: any) => s.status === 'active').length || 0 });
    } catch (e: any) { setError(e?.message || 'Unable to load newsletter information.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);

  // While a campaign is being delivered, refresh its sent/failed counts automatically.
  const hasProcessing = campaigns.some(c => c.status === 'processing');
  useEffect(() => {
    if (!hasProcessing) return;
    const timer = window.setInterval(() => { void refresh(); }, 5000);
    return () => window.clearInterval(timer);
  }, [hasProcessing]);

  const resetForm = () => { setSubject(''); setContent(''); setScheduledAt(''); setEditingId(null); setAttachments([]); };
  const submit = async (action: 'draft' | 'send' | 'schedule') => {
    setMessage(''); setError('');
    if (!subject.trim() || !content.trim()) { setError('Please enter both a subject and newsletter content.'); return; }
    if (action === 'schedule' && (!scheduledAt || new Date(scheduledAt).getTime() <= Date.now())) {
      setError('Choose a future date and time for scheduling.'); return;
    }
    setSaving(true);
    try {
      const payload = { subject: subject.trim(), content: content.trim(), attachments: attachments.map(({ storedName, filename }) => ({ storedName, filename })), scheduledAt: action === 'schedule' ? new Date(scheduledAt).toISOString() : null };
      if (action === 'draft') await ApiService.saveNewsletterDraft({ ...payload, id: editingId || undefined });
      if (action === 'send') await ApiService.sendNewsletterCampaign({ ...payload, id: editingId || undefined });
      if (action === 'schedule') await ApiService.scheduleNewsletterCampaign({ ...payload, id: editingId || undefined });
      setMessage(action === 'draft' ? 'Draft saved.' : action === 'send' ? 'Campaign submitted for sending.' : 'Campaign scheduled successfully.');
      resetForm(); await refresh();
    } catch (e: any) { setError(e?.message || 'Unable to save the campaign.'); }
    finally { setSaving(false); }
  };
  const edit = (campaign: Campaign) => {
    setEditingId(campaign.id); setSubject(campaign.subject); setContent(campaign.content); setAttachments(campaign.attachments || []);
    setScheduledAt(campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : '');
    setMessage(''); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const cancel = async (id: string) => {
    if (!window.confirm('Cancel this draft or scheduled campaign?')) return;
    try { await ApiService.cancelNewsletterCampaign(id); await refresh(); setMessage('Campaign cancelled.'); }
    catch (e: any) { setError(e?.message || 'Unable to cancel campaign.'); }
  };
  const dateLabel = (value?: string | null) => value ? new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—';
  const activeCampaigns = useMemo(() => campaigns.filter(c => ['draft', 'scheduled'].includes(c.status)), [campaigns]);

  return <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="rounded-2xl border border-[#E5DFC5] bg-white p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase text-[#5C6760]"><Users className="h-4 w-4"/> Subscribers</div><div className="mt-2 text-2xl font-bold text-[#143D2B]">{stats.total}</div></div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800"><Mail className="h-4 w-4"/> Active subscribers</div><div className="mt-2 text-2xl font-bold text-emerald-900">{stats.active}</div></div>
      <div className="rounded-2xl border border-[#E5DFC5] bg-white p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase text-[#5C6760]"><CalendarClock className="h-4 w-4"/> Drafts / scheduled</div><div className="mt-2 text-2xl font-bold text-[#C85A32]">{activeCampaigns.length}</div></div>
    </div>

    <section className="rounded-3xl border border-[#E5DFC5] bg-white p-5 sm:p-6 shadow-sm space-y-4">
      <div><span className="text-[10px] font-bold uppercase tracking-widest text-[#C85A32]">Newsletter studio</span><h2 className="mt-1 text-lg font-bold font-serif-heading text-[#143D2B]">{editingId ? 'Edit Campaign' : 'Create Newsletter Campaign'}</h2><p className="mt-1 text-xs text-[#5C6760]">Prepare monthly field stories, reports, research updates and upcoming events.</p></div>
      <div className="space-y-1.5"><label className="text-xs font-bold text-[#143D2B]">Email subject *</label><input value={subject} onChange={e => setSubject(e.target.value)} className={inputClass} placeholder="Samajbandh Monthly Update – November" maxLength={180}/></div>
      <div className="space-y-1.5"><label className="text-xs font-bold text-[#143D2B]">Newsletter content *</label><textarea value={content} onChange={e => setContent(e.target.value)} className={`${inputClass} min-h-48 resize-y`} placeholder="Write your monthly updates, activities, impact stories and announcements..." maxLength={30000}/><p className="text-right text-[10px] text-[#879086]">{content.length}/30,000</p></div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#143D2B]">Attachments (optional)</label>
        <div className="flex flex-wrap items-center gap-3">
          <label className={`${buttonSecondary} cursor-pointer`}>
            <Paperclip className="h-4 w-4"/>{uploading ? 'Uploading…' : 'Attach files'}
            <input type="file" multiple className="hidden" disabled={uploading || attachments.length >= MAX_FILES}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.png,.jpg,.jpeg,.gif,.webp"
              onChange={e => { void addFiles(e.target.files); e.target.value = ''; }}/>
          </label>
          <span className="text-[11px] text-[#879086]">Up to {MAX_FILES} files, 5 MB each (PDF, Office, CSV, TXT, images).</span>
        </div>
        {attachments.length > 0 && <ul className="space-y-1.5">
          {attachments.map(a => <li key={a.storedName} className="flex items-center justify-between gap-3 rounded-lg border border-[#E5DFC5] bg-[#FBF9F5] px-3 py-2 text-xs">
            <span className="flex min-w-0 items-center gap-2 text-[#1F2421]"><Paperclip className="h-3.5 w-3.5 shrink-0 text-[#5C6760]"/><span className="truncate">{a.filename}</span><span className="shrink-0 text-[#879086]">{formatSize(a.size)}</span></span>
            <button type="button" onClick={() => removeAttachment(a.storedName)} aria-label={`Remove ${a.filename}`} className="text-rose-600 hover:text-rose-800"><X className="h-4 w-4"/></button>
          </li>)}
        </ul>}
      </div>
      <div className="rounded-xl border border-[#E5DFC5] bg-[#FBF9F5] p-3 text-xs text-[#5C6760]">Recipients: all active, subscribed newsletter users. Subscriber email addresses will not be exposed to other recipients. Scheduled times are interpreted in India Standard Time.</div>
      <div className="space-y-1.5"><label className="text-xs font-bold text-[#143D2B]">Schedule date and time (IST)</label><input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className={inputClass}/></div>
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}
      {message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{message}</div>}
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonSecondary} disabled={saving || uploading} onClick={() => void submit('draft')}><FileText className="h-4 w-4"/>Save Draft</button>
        <button type="button" className={buttonPrimary} disabled={saving || uploading} onClick={() => void submit('send')}><Send className="h-4 w-4"/>Send Now</button>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C85A32] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#b54c26] disabled:opacity-50" disabled={saving || uploading} onClick={() => void submit('schedule')}><CalendarClock className="h-4 w-4"/>Schedule</button>
        {editingId && <button type="button" className={buttonSecondary} onClick={resetForm}>Discard changes</button>}
      </div>
    </section>

    <section className="overflow-hidden rounded-3xl border border-[#E5DFC5] bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[#E5DFC5] p-5"><div><h3 className="font-bold text-[#143D2B]">Campaign History</h3><p className="mt-1 text-[11px] text-[#879086]">Review drafts, scheduled messages and delivery results.</p></div><button className={buttonSecondary} onClick={() => void refresh()} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}/>Refresh</button></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-[#FBF9F5] text-[10px] uppercase tracking-wider text-[#5C6760]"><tr><th className="px-4 py-3">Campaign</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Scheduled / Created</th><th className="px-4 py-3">Delivery</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-[#E5DFC5]">{campaigns.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-[#879086]">{loading ? 'Loading campaigns...' : 'No campaigns created yet.'}</td></tr> : campaigns.map(c => <tr key={c.id} className="hover:bg-[#FBF9F5]"><td className="px-4 py-3"><div className="font-bold text-[#1F2421]">{c.subject}</div><div className="mt-1 text-[10px] text-[#879086]">Created {dateLabel(c.createdAt)}</div></td><td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">{c.status.replace('_', ' ')}</span></td><td className="px-4 py-3 text-[#5C6760]">{dateLabel(c.scheduledAt)}</td><td className="px-4 py-3 text-[#5C6760]">{c.sentCount || 0} sent / {c.failedCount || 0} failed{c.recipientCount ? ` of ${c.recipientCount}` : ''}</td><td className="px-4 py-3"><div className="flex gap-2">{['draft', 'scheduled'].includes(c.status) && <><button onClick={() => edit(c)} className="font-bold text-[#143D2B] hover:underline">Edit</button><button onClick={() => void cancel(c.id)} className="font-bold text-rose-600 hover:underline">Cancel</button></>}</div></td></tr>)}</tbody></table></div>
    </section>
  </div>;
};
