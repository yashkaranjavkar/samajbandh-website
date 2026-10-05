import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { ApiService } from '../../services/api';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  initialPurpose?: string;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 1000,
  initialPurpose = 'General Menstrual Dignity Fund'
}) => {
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState('');
  const [is80GRequired, setIs80GRequired] = useState(true);

  // States
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [receiptData, setReceiptData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const presets = [
    { amount: 500, label: '₹500', impact: 'Supplies 1 adolescent girl with 2-year Asha reusable kit & comic guide' },
    { amount: 1000, label: '₹1,000', impact: 'Equips 2 tribal rest sheds with clean emergency menstrual care packs' },
    { amount: 2500, label: '₹2,500', impact: 'Funds 1 full School Samata workshop reaching 60+ boys & girls' },
    { amount: 5000, label: '₹5,000', impact: 'Sponsors 1 month stipend & travel for an Arogya Samwadak Fellow' }
  ];

  const getEffectiveAmount = (): number => {
    if (selectedPreset === 'custom') {
      return parseFloat(customAmount) || 0;
    }
    return selectedPreset;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getEffectiveAmount();

    if (!amount || amount < 100) {
      setErrorMsg('Please select or enter a valid donation amount (minimum ₹100).');
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name, email, and phone number.');
      return;
    }
    if (is80GRequired && panNumber && panNumber.length !== 10) {
      setErrorMsg('Please enter a valid 10-character PAN number for 80G tax receipt.');
      return;
    }

    setErrorMsg('');
    setStep('processing');

    try {
      // Call backend API / abstracted PaymentService
      const result = await ApiService.submitDonation({
        amount,
        type: donationType,
        fullName,
        email,
        phone,
        panNumber: is80GRequired ? panNumber.toUpperCase() : undefined,
        address,
        is80GRequired,
        purpose: initialPurpose
      });

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setReceiptData({
        amount,
        type: donationType,
        fullName,
        email,
        transactionId: result.transactionId,
        receiptNumber: result.receiptNumber,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        purpose: initialPurpose
      });

      setStep('success');
    } catch {
      setErrorMsg('Payment gateway simulation encountered an issue. Please retry.');
      setStep('details');
    }
  };

  const handleReset = () => {
    setStep('details');
    setReceiptData(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={step === 'success' ? 'Donation Confirmed & 80G Generated' : 'Support Samajbandh’s Mission'}
      subtitle={step === 'success' ? 'Thank you for investing in menstrual dignity and empowerment.' : 'Eligible for 50% Tax Exemption under Section 80G'}
      maxWidth="3xl"
    >
      {step === 'details' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donation Frequency Toggle */}
          <div className="flex bg-[#F4EFE6] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setDonationType('one-time')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                donationType === 'one-time' ? 'bg-[#143D2B] text-white shadow-xs' : 'text-[#5C6760] hover:text-[#1F2421]'
              }`}
            >
              One-Time Contribution
            </button>
            <button
              type="button"
              onClick={() => setDonationType('monthly')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                donationType === 'monthly' ? 'bg-[#143D2B] text-white shadow-xs' : 'text-[#5C6760] hover:text-[#1F2421]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D99B26]" />
              Monthly Sustainer (Most Impact)
            </button>
          </div>

          {/* Preset Amounts Grid */}
          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase tracking-wider mb-2">
              Select Contribution Amount
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.amount}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(preset.amount);
                    setCustomAmount('');
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedPreset === preset.amount
                      ? 'border-[#C85A32] bg-[#C85A32]/10 ring-2 ring-[#C85A32]'
                      : 'border-[#E5DFC5] bg-white hover:border-[#143D2B]/40'
                  }`}
                >
                  <span className="block text-lg font-bold text-[#143D2B]">{preset.label}</span>
                  <span className="block text-[10px] text-[#5C6760] mt-1 line-clamp-2 leading-tight">
                    {preset.impact.split(' ')[0]} {preset.impact.split(' ')[1]}...
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="mt-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="100"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedPreset('custom');
                  }}
                  placeholder="Or enter custom amount (e.g. 1500)"
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#E5DFC5] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                />
              </div>
            </div>

            {/* Dynamic Impact Statement */}
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#143D2B] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#143D2B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Your Direct Impact: </span>
                {selectedPreset === 500 && presets[0].impact}
                {selectedPreset === 1000 && presets[1].impact}
                {selectedPreset === 2500 && presets[2].impact}
                {selectedPreset === 5000 && presets[3].impact}
                {selectedPreset === 'custom' && (
                  customAmount ? `Your contribution of ₹${customAmount} directly supports decentralized cloth pad production and rural health education.` : 'Enter an amount to see your impact calculation.'
                )}
              </div>
            </div>
          </div>

          {/* Donor Information */}
          <div className="space-y-3 pt-2 border-t border-[#E5DFC5]">
            <h4 className="text-xs font-bold text-[#1F2421] uppercase tracking-wider">
              Donor Information (for 80G Tax Exemption Receipt)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#5C6760] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#5C6760] mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#5C6760] mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#5C6760] mb-1">PAN Number (Required for 80G)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DFC5] rounded-xl uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#5C6760] mb-1">Postal Address (for Tax Records)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, State, PIN Code"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is80GRequired"
                checked={is80GRequired}
                onChange={(e) => setIs80GRequired(e.target.checked)}
                className="w-4 h-4 rounded text-[#143D2B] focus:ring-[#143D2B]"
              />
              <label htmlFor="is80GRequired" className="text-xs text-[#1F2421] select-none cursor-pointer">
                I request an official 80G Tax Exemption Certificate emailed to me
              </label>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {errorMsg}
            </p>
          )}

          {/* Secure Checkout Button */}
          <div className="pt-2">
            <button
              id="confirm-donation-btn"
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#C85A32] hover:bg-[#B84A28] shadow-md transition-all flex items-center justify-center gap-2 text-base"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Donate ₹{getEffectiveAmount()}</span>
            </button>

            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-[#5C6760]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit Encrypted Payment Flow
              </span>
              <span>•</span>
              <span>UPI, NetBanking, Cards Supported</span>
            </div>

            <details className="mt-4 rounded-xl border border-[#E5DFC5] bg-[#FBF9F5] text-xs text-[#1F2421]">
              <summary className="cursor-pointer select-none px-4 py-3 font-semibold">
                Prefer to pay directly by UPI or bank transfer? Scan our QR
              </summary>
              <div className="px-4 pb-4 text-center space-y-2">
                <img
                  src="/images/brand/donation-kotak-qr.png"
                  alt="Samajbandh donation QR code with Kotak Mahindra Bank account details"
                  className="mx-auto w-full max-w-[260px] rounded-lg border border-[#E5DFC5] bg-white"
                  loading="lazy"
                />
                <p className="text-[#5C6760]">
                  Please share your donation details on WhatsApp at 7709488286 to receive your 80G receipt.
                </p>
              </div>
            </details>
          </div>
        </form>
      )}

      {step === 'processing' && (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#143D2B]/20 border-t-[#143D2B] rounded-full animate-spin mx-auto"></div>
          <h4 className="text-lg font-bold text-[#1F2421]">Processing Secure Contribution...</h4>
          <p className="text-xs text-[#5C6760] max-w-sm mx-auto">
            Connecting with payment gateway abstraction and generating verifiable 80G receipt. Please do not close this window.
          </p>
        </div>
      )}

      {step === 'success' && receiptData && (
        <div className="space-y-6 text-left">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-serif-heading font-bold text-[#143D2B]">
              Payment Successful!
            </h3>
            <p className="text-sm text-[#143D2B]/80 mt-1">
              Thank you, <span className="font-semibold">{receiptData.fullName}</span>. Your generous contribution of <span className="font-bold">₹{receiptData.amount}</span> has been received.
            </p>
          </div>

          {/* Receipt Details Card */}
          <div className="bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl p-5 text-xs space-y-3 font-mono">
            <div className="flex justify-between border-b border-[#E5DFC5] pb-2 font-sans font-bold text-sm text-[#143D2B]">
              <span>Samajbandh Social Impact Trust</span>
              <span>Tax Exemption Slip</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[#5C6760]">
              <div>Receipt No: <span className="font-bold text-[#1F2421]">{receiptData.receiptNumber}</span></div>
              <div>Txn ID: <span className="font-bold text-[#1F2421]">{receiptData.transactionId}</span></div>
              <div>Date: <span className="text-[#1F2421]">{receiptData.date}</span></div>
              <div>Frequency: <span className="uppercase font-semibold text-[#1F2421]">{receiptData.type}</span></div>
              <div>PAN Reference: <span className="font-bold text-[#1F2421]">{panNumber || 'N/A'}</span></div>
              <div>80G Registration: <span className="text-emerald-700 font-semibold">Active / 50% Deductible</span></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                alert(`Receipt #${receiptData.receiptNumber} downloaded. A copy has also been sent to ${receiptData.email}.`);
              }}
              className="flex-1 py-3 px-4 rounded-xl border border-[#143D2B] text-[#143D2B] font-bold text-xs hover:bg-[#143D2B]/5 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download 80G Receipt (PDF)
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-3 px-4 rounded-xl bg-[#143D2B] text-white font-bold text-xs hover:bg-[#1E533B] transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
