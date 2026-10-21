import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { ApiService } from '../services/api';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface ContactPageProps {
  onOpenDonate: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenDonate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('loading');
    try {
      await ApiService.submitContact({
        name,
        email,
        phone,
        subject,
        message
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="contact"
        sections={{
          // 13.1 HERO HEADER
          hero: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Contact Hero">
              <div className="bg-[#143D2B] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-emerald-800">
                <div className="max-w-3xl space-y-6 relative z-10">
                  <span className="text-xs uppercase font-bold text-[#D99B26] tracking-widest block">
                    CONNECT WITH SAMAJBANDH
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-heading font-extrabold text-white leading-tight">
                    Let’s Collaborate to Transform Menstrual Health
                  </h1>
                  <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
                    Whether you are an individual wanting to volunteer, a corporate CSR leader looking to sponsor villages, an educator organizing a workshop, or a journalist writing on menstrual equity — we are here to support you.
                  </p>
                </div>
              </div>
            </section>
          ),

          // 13.2 CONTACT DETAILS & OFFICE HUBS
          officeHubs: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Office Hubs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
                {/* Pune HQ */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFC5] shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#143D2B]/10 text-[#143D2B] flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] block">
                    Registered Head Office
                  </span>
                  <h3 className="text-lg font-serif-heading font-bold text-[#1F2421]">
                    Pune Coordination Centre
                  </h3>
                  <p className="text-xs text-[#5C6760] leading-relaxed">
                    Office 402, Samajbandh Bhavan, Near Tilak Smarak Mandir, Sadashiv Peth, Pune, Maharashtra 411030
                  </p>
                  <div className="pt-2 border-t border-[#E5DFC5] space-y-1.5 text-xs text-[#1F2421]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#143D2B]" />
                      <span>+91 98220 12345 / 020 2445 6789</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#143D2B]" />
                      <span>contact@samajbandh.org</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#5C6760] pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mon – Sat: 9:30 AM – 6:30 PM</span>
                    </div>
                  </div>
                </div>

                {/* Junnar Production Centre */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFC5] shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#87986A] block">
                    Central Production Hub
                  </span>
                  <h3 className="text-lg font-serif-heading font-bold text-[#1F2421]">
                    Junnar Asha Micro-Unit
                  </h3>
                  <p className="text-xs text-[#5C6760] leading-relaxed">
                    Plot 14, Rural Women’s Industrial Cluster, Narayangaon Road, Junnar, Pune District, Maharashtra 410502
                  </p>
                  <div className="pt-2 border-t border-[#E5DFC5] space-y-1.5 text-xs text-[#1F2421]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#143D2B]" />
                      <span>+91 98220 54321</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#143D2B]" />
                      <span>production@samajbandh.org</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#5C6760] pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mon – Fri: 9:00 AM – 5:30 PM</span>
                    </div>
                  </div>
                </div>

                {/* Gadchiroli Field Hub */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFC5] shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#D99B26]/10 text-[#D99B26] flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#143D2B] block">
                    Tribal Field Desk
                  </span>
                  <h3 className="text-lg font-serif-heading font-bold text-[#1F2421]">
                    Gadchiroli Tribal Desk
                  </h3>
                  <p className="text-xs text-[#5C6760] leading-relaxed">
                    Community Health Center Road, Kurkheda, Gadchiroli District, Maharashtra 441209
                  </p>
                  <div className="pt-2 border-t border-[#E5DFC5] space-y-1.5 text-xs text-[#1F2421]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#143D2B]" />
                      <span>+91 98220 98765</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#143D2B]" />
                      <span>kurma.sudhar@samajbandh.org</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#5C6760] pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mon – Sat: 8:30 AM – 5:00 PM</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          ),

          // 13.3 INTERACTIVE CONTACT FORM & MAP
          contactForm: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Contact Form">
              <div className="bg-[#FBF9F5] rounded-3xl p-8 sm:p-12 border border-[#E5DFC5] grid grid-cols-1 lg:grid-cols-12 gap-12">
          
                {/* Form */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#143D2B] tracking-wider">
                      Send a Message
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#1F2421] mt-1">
                      How Can We Support You?
                    </h2>
                  </div>

                  {status === 'success' ? (
                    <div className="bg-white p-8 rounded-2xl border border-[#E5DFC5] text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <h4 className="text-lg font-bold font-serif-heading text-[#143D2B]">
                        Message Dispatched Successfully
                      </h4>
                      <p className="text-xs text-[#5C6760]">
                        Thank you for writing. Our desk coordinator will reply to <span className="font-semibold">{email}</span> within 24 business hours.
                      </p>
                      <button
                        onClick={() => setStatus('idle')}
                        className="mt-2 text-xs font-bold text-[#143D2B] hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E5DFC5]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Full Name *</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Email Address *</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Inquiry Topic *</label>
                          <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                          >
                            <option value="General Inquiry">General Information</option>
                            <option value="CSR Partnership">Corporate CSR Partnership</option>
                            <option value="School Workshop Request">School / College Workshop</option>
                            <option value="Bulk Pad Order">Institutional / Bulk Pad Order</option>
                            <option value="Volunteering Inquiry">Volunteering & Fellowships</option>
                            <option value="Media & Press">Media, Interview & Press</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">Your Message *</label>
                        <textarea
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Write your query in detail..."
                          className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-3.5 rounded-xl bg-[#143D2B] hover:bg-[#1E533B] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>{status === 'loading' ? 'Sending Message...' : 'Send Message'}</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Map & Statutory Governance Info */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-[#143D2B] text-white p-6 rounded-3xl border border-emerald-800 space-y-4">
                    <span className="text-xs font-bold uppercase text-[#D99B26]">Direct Reach</span>
                    <h3 className="text-xl font-serif-heading font-bold text-white">
                      Visit or Dispatch to Pune
                    </h3>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      Our central secretariat in Sadashiv Peth, Pune is open for parcel deliveries, cloth drop-offs, and pre-scheduled volunteer meetings.
                    </p>
              
                    <div className="p-4 rounded-xl bg-white/10 text-xs text-emerald-200 space-y-1">
                      <span className="font-bold text-white block">Directions:</span>
                      <span>5 minutes walk from Tilak Smarak Mandir, near Alka Talkies Chowk, central Pune.</span>
                    </div>
                  </div>

                  {/* Grievance & POSH Redressal Policy Note */}
                  <div className="bg-white p-6 rounded-3xl border border-[#E5DFC5] space-y-2">
                    <span className="text-xs font-bold uppercase text-[#87986A] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#87986A]" />
                      POSH & Institutional Ethics Redressal
                    </span>
                    <p className="text-xs text-[#5C6760] leading-relaxed">
                      Samajbandh maintains a zero-tolerance policy towards sexual harassment, exploitation, or discrimination. To report concerns directly to our Internal Complaints Committee (ICC), email: <span className="font-semibold text-[#143D2B]">icc.redressal@samajbandh.org</span>.
                    </p>
                  </div>
                </div>

              </div>
            </section>
          ),

          // BOTTOM CTA BAND
          bottomCta: (
            <BottomCTABand onOpenDonate={onOpenDonate} />
          ),
        }}
      />

    </div>
  );
};
