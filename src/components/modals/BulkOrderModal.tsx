import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle2, Building, PackageCheck, Send } from 'lucide-react';
import { ApiService } from '../../services/api';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultItem?: string;
}

export const BulkOrderModal: React.FC<BulkOrderModalProps> = ({
  isOpen,
  onClose,
  defaultItem = 'Asha Reusable Cloth Pads'
}) => {
  const [orgName, setOrgName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [itemType, setItemType] = useState(defaultItem);
  const [quantity, setQuantity] = useState(100);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !contactPerson.trim() || !email.trim() || !phone.trim()) {
      return;
    }

    setStatus('loading');
    try {
      await ApiService.submitBulkOrder({
        organizationName: orgName,
        contactPerson,
        email,
        phone,
        itemType,
        quantity: Number(quantity),
        notes
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setOrgName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={status === 'success' ? 'Inquiry Received!' : 'Institutional & CSR Bulk Procurement'}
      subtitle="Equip schools, factories, or rural community clusters with subsidized sanitary kits."
      maxWidth="xl"
    >
      {status === 'success' ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold font-serif-heading text-[#143D2B]">
            Thank You for Partnering!
          </h4>
          <p className="text-xs sm:text-sm text-[#5C6760] max-w-md mx-auto">
            Our institutional partnerships desk will email a customized quotation, delivery timelines, and tax deduction details to <span className="font-semibold text-[#1F2421]">{email}</span> within 24 hours.
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
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#143D2B] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#143D2B] shrink-0" />
            <span>Special subsidized rates for Zilla Parishad schools, NGOs, and CSR village sponsorships.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Organization / School / CSR Entity *</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Tata Motors CSR / Saraswati Vidyalaya"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Contact Person Name *</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Anita Shinde"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Designation / Role</label>
              <input
                type="text"
                placeholder="e.g. CSR Lead / Principal"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Official Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anita@company.com"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Phone Number *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Product / Kit Required *</label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
              >
                <option value="Asha Reusable Cloth Pads (Pack of 4)">Asha Reusable Cloth Pads (Pack of 4)</option>
                <option value="Samata School Menstrual Health Kit">Samata School Menstrual Health Kit</option>
                <option value="Emergency Relief Menstrual Kit">Emergency Relief Menstrual Kit</option>
                <option value="Custom Workshop + Pad Distribution Drive">Custom Workshop + Pad Distribution Drive</option>
                <option value="ToT Training for Field Staff">ToT Training for Field Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Estimated Quantity (Units) *</label>
              <input
                type="number"
                min="25"
                step="25"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Target District / Delivery Requirements</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specify destination locations, timeline, or workshop requirements..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
            ></textarea>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-1 py-3 px-4 bg-[#C85A32] hover:bg-[#B84A28] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'loading' ? 'Submitting Inquiry...' : 'Submit Bulk Order Inquiry'}</span>
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
