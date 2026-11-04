import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarCheck, ChevronDown, ChevronUp, Download, ImagePlus, MapPin, Pencil, Plus, RefreshCw, Search, Trash2, Users, Video, X,
} from 'lucide-react';
import { ApiService } from '../../services/api';
import { EVENTS_CHANGED } from '../../hooks/useLiveRegistrations';
import type { EventItem } from '../../types';
import type { EventRegistrationRecord } from '../../../server/db/database';

type Status = EventRegistrationRecord['status'];

const EVENT_TYPES: EventItem['type'][] = ['Workshop', 'Fellowship Camp', 'Webinar', 'Awareness Drive', 'Fundraiser'];
const STATUS_LABEL: Record<Status, string> = {
  registered: 'Registered', attended: 'Attended', absent: 'Absent', cancelled: 'Cancelled',
};
const POLL_MS = 30000;
// Lets the public header's "Live Registrations" badge refresh immediately after an admin change.
const notifyEventsChanged = () => window.dispatchEvent(new Event(EVENTS_CHANGED));

const inputClass = 'w-full rounded-xl border border-[#E5DFC5] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1F2421] outline-none focus:ring-2 focus:ring-[#143D2B]';
const buttonPrimary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#143D2B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1d523b] disabled:cursor-not-allowed disabled:opacity-50';
const buttonSecondary = 'inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5DFC5] bg-white px-4 py-2.5 text-xs font-bold text-[#143D2B] hover:bg-[#FBF9F5] disabled:opacity-50';

const emptyForm = {
  title: '', type: 'Workshop' as EventItem['type'], eventDate: '', startTime: '', endTime: '', location: '',
  totalSeats: '', eligibility: '', description: '', image: '', isVirtual: false, registrationOpen: true,
};
type FormState = typeof emptyForm;
type FormErrors = Partial<Record<keyof FormState, string>>;

// "14:30" -> "2:30 PM"
function to12h(value: string): string {
  const [h, m] = value.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
// "2:30 PM" -> "14:30"
function to24h(hour: string, minute: string, meridiem: string): string {
  let h = Number(hour) % 12;
  if (meridiem.toUpperCase() === 'PM') h += 12;
  return `${String(h).padStart(2, '0')}:${minute}`;
}
const buildTimeLabel = (start: string, end: string) => `${to12h(start)} – ${to12h(end)} IST`;
// Reads "10:00 AM – 4:00 PM IST" back into the two clock inputs (empty if the text is free-form).
function parseTimeLabel(label: string): { startTime: string; endTime: string } {
  const m = label.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  return m ? { startTime: to24h(m[1], m[2], m[3]), endTime: to24h(m[4], m[5], m[6]) } : { startTime: '', endTime: '' };
}

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (f.title.trim().length < 3) e.title = 'Title is required (min 3 characters).';
  if (!f.eventDate) e.eventDate = 'Event date is required.';
  if (!f.startTime) e.startTime = 'Start time is required.';
  if (!f.endTime) e.endTime = 'End time is required.';
  else if (f.startTime && f.endTime <= f.startTime) e.endTime = 'End time must be after the start time.';
  if (!f.location.trim()) e.location = 'Location is required.';
  const seats = Number(f.totalSeats);
  if (!Number.isInteger(seats) || seats < 1) e.totalSeats = 'Enter a whole number of seats (1 or more).';
  if (!f.eligibility.trim()) e.eligibility = 'Eligibility is required.';
  if (f.description.trim().length < 10) e.description = 'Description is required (min 10 characters).';
  return e;
}

const statusStyle = (s?: string) =>
  s === 'attended' ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
  : s === 'absent' ? 'bg-rose-50 text-rose-800 border-rose-300'
  : s === 'cancelled' ? 'bg-slate-100 text-slate-600 border-slate-300'
  : 'bg-amber-50 text-amber-800 border-amber-300';

const Field: React.FC<{ label: string; required?: boolean; error?: string; children: React.ReactNode; className?: string }> =
  ({ label, required, error, children, className = '' }) => (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-bold text-[#143D2B]">{label}{required && <span className="text-rose-600"> *</span>}</label>
      {children}
      {error && <p role="alert" className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );

interface Props {
  onRegistrationCount?: (count: number) => void;
}

export const EventManager: React.FC<Props> = ({ onRegistrationCount }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const updatingRef = useRef<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [eventList, regs] = await Promise.all([ApiService.getEvents(), ApiService.getEventRegistrations()]);
      // Do not overwrite an optimistic status change that is still being saved.
      if (updatingRef.current) return;
      setEvents(eventList);
      setRegistrations(regs);
      setError('');
      onRegistrationCount?.(regs.length);
    } catch (e: any) {
      if (!silent) setError(e?.message || 'Unable to load events and registrations.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [onRegistrationCount]);

  // Initial load + keep the view in sync with the database.
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(true), POLL_MS);
    const onFocus = () => void load(true);
    window.addEventListener('focus', onFocus);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', onFocus); };
  }, [load]);

  const changeStatus = async (reg: EventRegistrationRecord, status: Status) => {
    if (reg.status === status) return;
    const previous = reg.status;
    updatingRef.current = reg.id;
    setUpdatingId(reg.id);
    setError(''); setMessage('');
    setRegistrations(list => list.map(r => (r.id === reg.id ? { ...r, status } : r)));
    try {
      await ApiService.updateEventRegistrationStatus(reg.id, status);
    } catch (e: any) {
      setRegistrations(list => list.map(r => (r.id === reg.id ? { ...r, status: previous } : r)));
      setError(e?.message || 'Unable to update status. Please try again.');
    } finally {
      updatingRef.current = null;
      setUpdatingId(null);
    }
  };

  const toggleRegistration = async (event: EventItem) => {
    setError(''); setMessage('');
    try {
      await ApiService.updateEvent(event.id, { registrationOpen: !event.registrationOpen });
      setEvents(list => list.map(e => (e.id === event.id ? { ...e, registrationOpen: !event.registrationOpen } : e)));
      notifyEventsChanged();
    } catch (e: any) {
      setError(e?.message || 'Unable to update the event.');
    }
  };

  const removeEvent = async (event: EventItem) => {
    const count = registrations.filter(r => r.eventId === event.id).length;
    const ok = window.confirm(
      `Delete "${event.title}"?\n\nThis permanently removes the event from the website and the database` +
      (count ? `, together with its ${count} registration${count === 1 ? '' : 's'}` : '') +
      `.\nThis cannot be undone.`
    );
    if (!ok) return;
    setError(''); setMessage('');
    try {
      const result = await ApiService.deleteEvent(event.id);
      setEvents(list => list.filter(e => e.id !== event.id));
      const remaining = registrations.filter(r => r.eventId !== event.id);
      setRegistrations(remaining);
      onRegistrationCount?.(remaining.length);
      if (editingId === event.id) closeForm();
      const removed = result.data?.registrationsRemoved ?? 0;
      setMessage(`Event deleted${removed ? ` along with ${removed} registration${removed === 1 ? '' : 's'}` : ''}.`);
      notifyEventsChanged();
    } catch (e: any) {
      setError(e?.message || 'Unable to delete the event.');
    }
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    if (formErrors[key]) setFormErrors(fe => ({ ...fe, [key]: undefined }));
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); setFormErrors({}); };

  const startCreate = () => {
    setMessage(''); setError('');
    if (showForm && !editingId) { closeForm(); return; }
    setEditingId(null); setForm(emptyForm); setFormErrors({}); setShowForm(true);
  };

  const startEdit = (event: EventItem) => {
    setMessage(''); setError(''); setFormErrors({});
    setEditingId(event.id);
    setForm({
      title: event.title,
      type: event.type,
      eventDate: event.eventDate || '',
      ...parseTimeLabel(event.time),
      location: event.location,
      totalSeats: String(event.totalSeats),
      eligibility: event.eligibility,
      description: event.description,
      image: event.image || '',
      isVirtual: event.isVirtual,
      registrationOpen: event.registrationOpen,
    });
    setShowForm(true);
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleImageFile = async (file?: File) => {
    if (!file) return;
    setError('');
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) { setError('Please choose a PNG, JPG, WebP or GIF image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be 5 MB or smaller.'); return; }
    setUploadingImage(true);
    try {
      const uploaded = await ApiService.uploadFile('event-image', file);
      setField('image', uploaded.url || '');
    } catch (e: any) {
      setError(e?.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage('');
    const errs = validate(form);
    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    const { startTime, endTime, ...rest } = form;
    const payload = {
      ...rest,
      title: form.title.trim(),
      time: buildTimeLabel(startTime, endTime),
      location: form.location.trim(),
      eligibility: form.eligibility.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      totalSeats: Number(form.totalSeats),
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await ApiService.updateEvent(editingId, payload);
        setMessage('Event updated. The website now shows the new details.');
      } else {
        await ApiService.createEvent(payload);
        setMessage('Event saved. It now appears on the website and accepts registrations.');
      }
      closeForm();
      notifyEventsChanged();
      await load(true);
    } catch (err: any) {
      setError(err?.message || 'Unable to save the event.');
    } finally {
      setSubmitting(false);
    }
  };

  const query = search.trim().toLowerCase();
  const matches = (r: EventRegistrationRecord) =>
    (statusFilter === 'all' || (r.status || 'registered') === statusFilter) &&
    (!query || [r.name, r.email, r.phone, r.organization].some(v => v?.toLowerCase().includes(query)));

  // One section per event; registrations whose event no longer exists are kept visible at the end.
  const sections = useMemo(() => {
    const known = new Set(events.map(e => e.id));
    const list = events.map(event => ({ key: event.id, event, regs: registrations.filter(r => r.eventId === event.id) }));
    const orphans = registrations.filter(r => !known.has(r.eventId));
    if (orphans.length) list.push({ key: '__other', event: null as any, regs: orphans });
    return list;
  }, [events, registrations]);

  const totals = useMemo(() => ({
    events: events.length,
    registrations: registrations.length,
    attended: registrations.filter(r => r.status === 'attended').length,
    pending: registrations.filter(r => (r.status || 'registered') === 'registered').length,
  }), [events, registrations]);

  const exportCsv = (title: string, id: string, regs: EventRegistrationRecord[]) => {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const header = ['Name', 'Email', 'Phone', 'Organization', 'Status', 'Registered On', 'Motivation'];
    const rows = regs.map(r => [r.name, r.email, r.phone, r.organization || '', r.status || 'registered', r.createdAt || '', r.notes || '']);
    const csv = [header, ...rows].map(row => row.map(esc).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${(title || id).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary + actions */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5DFC5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-serif-heading text-[#143D2B]">Events &amp; Registrations</h2>
            <p className="text-xs text-[#5C6760] mt-0.5">Create events and manage each event&apos;s registered participants. Changes are saved to the database immediately.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonSecondary} onClick={() => void load()} disabled={loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button type="button" className={buttonPrimary} onClick={startCreate}>
              {showForm && !editingId ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} {showForm && !editingId ? 'Close form' : 'Create Event'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Events', value: totals.events },
            { label: 'Registrations', value: totals.registrations },
            { label: 'Awaiting attendance', value: totals.pending },
            { label: 'Attended', value: totals.attended },
          ].map(card => (
            <div key={card.label} className="rounded-xl border border-[#E5DFC5] bg-[#FBF9F5] p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C6760]">{card.label}</div>
              <div className="mt-1 text-xl font-bold text-[#143D2B]">{card.value}</div>
            </div>
          ))}
        </div>
      </div>

      {message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{message}</div>}
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}

      {/* Create / edit event */}
      {showForm && (
        <form ref={formRef} onSubmit={submitEvent} noValidate className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFC5] shadow-xs space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C85A32]">{editingId ? 'Edit event' : 'New event'}</span>
            <h3 className="mt-1 text-base font-bold font-serif-heading text-[#143D2B]">Event details</h3>
            <p className="text-[11px] text-[#879086] mt-0.5">Fields marked * are required.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Event title" required error={formErrors.title} className="sm:col-span-2">
              <input className={inputClass} value={form.title} maxLength={200} onChange={e => setField('title', e.target.value)} placeholder="Community Menstrual Health Workshop" />
            </Field>
            <Field label="Event type" required error={formErrors.type}>
              <select className={inputClass} value={form.type} onChange={e => setField('type', e.target.value as EventItem['type'])}>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Total seats" required error={formErrors.totalSeats}>
              <input className={inputClass} type="number" min={1} step={1} value={form.totalSeats} onChange={e => setField('totalSeats', e.target.value)} placeholder="50" />
            </Field>
            <Field label="Date" required error={formErrors.eventDate}>
              <input className={inputClass} type="date" value={form.eventDate} onChange={e => setField('eventDate', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start time (IST)" required error={formErrors.startTime}>
                <input className={inputClass} type="time" value={form.startTime} onChange={e => setField('startTime', e.target.value)} />
              </Field>
              <Field label="End time (IST)" required error={formErrors.endTime}>
                <input className={inputClass} type="time" value={form.endTime} onChange={e => setField('endTime', e.target.value)} />
              </Field>
            </div>
            <Field label="Location" required error={formErrors.location} className="sm:col-span-2">
              <input className={inputClass} value={form.location} maxLength={200} onChange={e => setField('location', e.target.value)} placeholder="Samajbandh Training Center, Pune  /  Virtual (Zoom)" />
            </Field>
            <Field label="Eligibility" required error={formErrors.eligibility} className="sm:col-span-2">
              <input className={inputClass} value={form.eligibility} maxLength={300} onChange={e => setField('eligibility', e.target.value)} placeholder="Who can attend?" />
            </Field>
            <Field label="Description" required error={formErrors.description} className="sm:col-span-2">
              <textarea className={`${inputClass} min-h-28 resize-y`} value={form.description} maxLength={3000} onChange={e => setField('description', e.target.value)} placeholder="What will happen at this event?" />
            </Field>
            <Field label="Event image (optional, PNG/JPG/WebP/GIF, max 5 MB)" className="sm:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                {form.image && <img src={form.image} alt="Event preview" className="h-20 w-32 rounded-lg border border-[#E5DFC5] object-cover" />}
                <label className={`${buttonSecondary} cursor-pointer`}>
                  <ImagePlus className="w-3.5 h-3.5" /> {uploadingImage ? 'Uploading…' : form.image ? 'Replace image' : 'Upload image'}
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" disabled={uploadingImage}
                    onChange={e => { void handleImageFile(e.target.files?.[0]); e.target.value = ''; }} />
                </label>
                {form.image && <button type="button" className="text-xs font-bold text-rose-600 hover:underline" onClick={() => setField('image', '')}>Remove</button>}
              </div>
              <p className="text-[11px] text-[#879086]">If no image is added, a default image is used.</p>
            </Field>
            <div className="sm:col-span-2 flex flex-wrap gap-6 text-xs font-bold text-[#143D2B]">
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.isVirtual} onChange={e => setField('isVirtual', e.target.checked)} /> Virtual event</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.registrationOpen} onChange={e => setField('registrationOpen', e.target.checked)} /> Open for registration</label>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className={buttonPrimary} disabled={submitting || uploadingImage}>
              {submitting ? 'Saving…' : editingId ? 'Save changes' : 'Save & publish event'}
            </button>
            <button type="button" className={buttonSecondary} onClick={closeForm}>Cancel</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5DFC5] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#879086] absolute left-3 top-1/2 -translate-y-1/2" />
          <input className={`${inputClass} pl-9`} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search participants by name, email, phone or organization" />
        </div>
        <select className={`${inputClass} sm:w-56`} value={statusFilter} onChange={e => setStatusFilter(e.target.value as 'all' | Status)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {(Object.keys(STATUS_LABEL) as Status[]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </div>

      {/* One section per event */}
      {loading && sections.length === 0 ? (
        <div className="rounded-2xl border border-[#E5DFC5] bg-white p-10 text-center text-sm text-slate-400">Loading events…</div>
      ) : sections.length === 0 ? (
        <div className="rounded-2xl border border-[#E5DFC5] bg-white p-10 text-center text-sm text-slate-400">No events yet. Use “Create Event” to add one.</div>
      ) : sections.map(({ key, event, regs }) => {
        const visible = regs.filter(matches);
        const held = regs.filter(r => r.status !== 'cancelled').length;
        const isCollapsed = Boolean(collapsed[key]);
        const title = event ? event.title : 'Registrations for events that no longer exist';

        return (
          <section key={key} className="bg-white rounded-2xl border border-[#E5DFC5] shadow-xs overflow-hidden" aria-label={title}>
            <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E5DFC5]">
              <button type="button" onClick={() => setCollapsed(c => ({ ...c, [key]: !c[key] }))} className="text-left flex-1 min-w-0" aria-expanded={!isCollapsed}>
                <div className="flex flex-wrap items-center gap-2">
                  {event && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#143D2B]/10 text-[#143D2B]">{event.type}</span>}
                  {event && (
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${event.registrationOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {event.registrationOpen ? 'Registration open' : 'Registration closed'}
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 text-sm sm:text-base font-bold text-[#1F2421] leading-snug">{title}</h3>
                {event && (
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#5C6760]">
                    <span className="inline-flex items-center gap-1"><CalendarCheck className="w-3.5 h-3.5" />{event.date} · {event.time}</span>
                    <span className="inline-flex items-center gap-1">{event.isVirtual ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}{event.location}</span>
                  </div>
                )}
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF9F5] border border-[#E5DFC5] px-3 py-1.5 text-xs font-bold text-[#143D2B]">
                  <Users className="w-3.5 h-3.5" />
                  {event ? `${held} / ${event.totalSeats} seats` : `${regs.length} registered`}
                </span>
                {event && (
                  <button type="button" className={buttonSecondary} onClick={() => startEdit(event)}>
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
                {event && (
                  <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50" onClick={() => void removeEvent(event)}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
                {event && (
                  <button type="button" className={buttonSecondary} onClick={() => void toggleRegistration(event)}>
                    {event.registrationOpen ? 'Close registration' : 'Reopen registration'}
                  </button>
                )}
                <button type="button" className={buttonSecondary} disabled={visible.length === 0} onClick={() => exportCsv(title, key, visible)}>
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
                <button type="button" className={buttonSecondary} onClick={() => setCollapsed(c => ({ ...c, [key]: !c[key] }))} aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}>
                  {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-xs">
                  <thead className="bg-[#FBF9F5] text-[10px] uppercase tracking-wider text-[#5C6760]">
                    <tr>
                      <th className="px-4 py-3">Participant</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Organization</th>
                      <th className="px-4 py-3">Registered</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFC5]">
                    {visible.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-slate-400">
                        {regs.length === 0 ? 'No one has registered for this event yet.' : 'No participants match the current filters.'}
                      </td></tr>
                    ) : visible.map(reg => (
                      <tr key={reg.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-bold text-[#1F2421] text-sm">{reg.name}</div>
                          <div className="text-[11px] text-[#5C6760]">{reg.email}</div>
                        </td>
                        <td className="px-4 py-3 text-[#5C6760]">{reg.phone}</td>
                        <td className="px-4 py-3 text-[#5C6760]">{reg.organization || 'Not provided'}</td>
                        <td className="px-4 py-3 text-[#5C6760]">{reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="px-4 py-3">
                          <select
                            value={reg.status || 'registered'}
                            disabled={updatingId === reg.id}
                            onChange={e => void changeStatus(reg, e.target.value as Status)}
                            aria-label={`Status for ${reg.name}`}
                            className={`px-2.5 py-2 rounded-lg text-xs font-bold border disabled:opacity-50 ${statusStyle(reg.status)}`}
                          >
                            {(Object.keys(STATUS_LABEL) as Status[]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                          </select>
                          {updatingId === reg.id && <span className="ml-2 text-[10px] text-slate-400">Saving…</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
