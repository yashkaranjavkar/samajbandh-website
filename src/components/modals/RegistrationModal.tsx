import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle2, Calendar, MapPin, Send } from 'lucide-react';
import { ApiService } from '../../services/api';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventItem?: {
    id: string;
    title: string;
    date: string;
    location: string;
    eligibility?: string;
  } | null;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  eventItem
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!eventItem) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      await ApiService.submitEventRegistration({
        eventId: eventItem.id,
        eventTitle: eventItem.title,
        name,
        email,
        phone,
        organization,
        notes
      });
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Registration failed. Please try again or contact our team.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={status === 'success' ? 'Registration Confirmed!' : 'Register for Program / Event'}
      subtitle={eventItem.title}
      maxWidth="xl"
    >
      {status === 'success' ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold font-serif-heading text-[#143D2B]">
            You're Registered!
          </h4>
          <p className="text-xs sm:text-sm text-[#5C6760] max-w-md mx-auto">
            A confirmation pass with schedule details, reporting venue, and preparatory materials has been dispatched to <span className="font-semibold text-[#1F2421]">{email}</span>.
          </p>
          <div className="pt-4">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-[#143D2B] text-white font-bold text-xs rounded-xl hover:bg-[#1E533B] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Event Context Pill */}
          <div className="p-3 bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl text-xs space-y-1 text-[#5C6760]">
            <div className="flex items-center gap-1.5 text-[#143D2B] font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{eventItem.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>{eventItem.location}</span>
            </div>
            {eventItem.eligibility && (
              <p className="text-[11px] text-[#87986A] pt-1">
                Eligibility: {eventItem.eligibility}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Patil"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">College / Organization / Village</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Pune University / Gram Panchayat Bhamragad"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Why do you wish to participate?</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell us briefly about your motivation or any questions..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
            ></textarea>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
              {errorMsg}
            </p>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-1 py-3 px-4 bg-[#143D2B] hover:bg-[#1E533B] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'loading' ? 'Submitting Registration...' : 'Confirm Registration'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-4 border border-gray-300 rounded-xl text-xs text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
