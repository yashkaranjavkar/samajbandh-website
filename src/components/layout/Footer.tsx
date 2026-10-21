import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Facebook,
  Award
} from 'lucide-react';
import { ApiService } from '../../services/api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await ApiService.submitNewsletter(email);
      setStatus('success');
      setMessage(res.message || 'Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Subscription failed. Please try again.');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bento Newsletter & Purpose Tile */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 mb-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Stay Connected with the Movement
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Subscribe for monthly field stories, reports & MHM research
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                Join 5,000+ change-makers, researchers, and supporters receiving our transparent updates. No spam, only genuine grassroots impact.
              </p>
            </div>
            
            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    id="newsletter-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status !== 'idle') setStatus('idle');
                    }}
                    placeholder="Enter your email address"
                    className="bg-slate-800/80 border border-slate-700 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 flex-1 transition-all"
                    disabled={status === 'loading'}
                    required
                  />
                  <button
                    id="newsletter-subscribe-btn"
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-[#C85A32] hover:bg-[#b54c26] text-white font-bold px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-rose-950/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {status === 'success' && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {message}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-xs text-rose-400 font-medium mt-1">
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bento Grid Links Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800 text-sm">
          
          {/* Bento Tile 1: Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4 bg-slate-900/50 border border-slate-800/80 p-7 rounded-[2rem]">
            <div className="flex items-center gap-3">
              <img
                src="/images/brand/samajbandh-logo.png"
                alt="Samajbandh logo"
                className="w-11 h-11 rounded-full shadow-md"
              />
              <span className="text-2xl font-black text-white tracking-tight">
                SAMAJBANDH
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              Dedicated to building menstrual dignity, reproductive health literacy, and women-led economic agency across Maharashtra and beyond.
            </p>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold bg-amber-500/10 py-2 px-3.5 rounded-xl border border-amber-500/20 w-fit">
                <Award className="w-4 h-4" />
                <span>Registered Non-Profit Trust | 80G & 12A Certified</span>
              </div>
            </div>

            {/* Social Bento Bar */}
            <div className="flex items-center space-x-2.5 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#C85A32] flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-slate-700">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#C85A32] flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-slate-700">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#C85A32] flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-slate-700">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#C85A32] flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-slate-700">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Bento Tile 2: Strategic Pillars & Work */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-7 rounded-[2rem]">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Our Work
            </h4>
            <ul className="space-y-2.5 text-slate-400 text-xs">
              <li><Link to="/our-work" className="hover:text-white transition-colors">Arogya Samwadak Fellows</Link></li>
              <li><Link to="/our-work" className="hover:text-white transition-colors">Asha Pad Production Units</Link></li>
              <li><Link to="/our-work" className="hover:text-white transition-colors">Kurma Sudhar (Rest Sheds)</Link></li>
              <li><Link to="/our-work" className="hover:text-white transition-colors">School & College Samata</Link></li>
              <li><Link to="/our-work" className="hover:text-white transition-colors">Capacity Building (ToT)</Link></li>
              <li><Link to="/our-work" className="hover:text-white transition-colors">Research & White Papers</Link></li>
              <li><Link to="/impact" className="hover:text-white transition-colors">Impact Telemetry</Link></li>
            </ul>
          </div>

          {/* Bento Tile 3: Resources & Shop */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-7 rounded-[2rem]">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Resources & Shop
            </h4>
            <ul className="space-y-2.5 text-slate-400 text-xs">
              <li><Link to="/products-services" className="hover:text-white transition-colors">Asha Reusable Cloth Pads</Link></li>
              <li><Link to="/products-services" className="hover:text-white transition-colors">School Menstrual Kits</Link></li>
              <li><Link to="/products-services" className="hover:text-white transition-colors">Emergency Relief Kits</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Downloadable IEC Posters</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Puberty Comic Books</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Menstrual Health FAQs</Link></li>
              <li><Link to="/news-events" className="hover:text-white transition-colors">Latest News & Press</Link></li>
            </ul>
          </div>

          {/* Bento Tile 4: Governance & Contact */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-7 rounded-[2rem]">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Contact & Trust
            </h4>
            <div className="space-y-3 text-slate-400 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Samajbandh Central Office, Pune, Maharashtra 411030</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="mailto:contact@samajbandh.org" className="hover:text-white transition-colors">contact@samajbandh.org</a>
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Link to="/transparency" className="text-xs text-amber-400 hover:underline flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Audited Financial Reports
              </Link>
              <Link to="/transparency" className="text-xs text-slate-400 hover:underline block">
                Child Protection & POSH Policies
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Mandatory Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Samajbandh Social Impact Trust. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <Link to="/policies?tab=privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/policies?tab=terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span>•</span>
            <Link to="/policies?tab=refund" className="hover:text-white transition-colors">Refund Policy</Link>
            <span>•</span>
            <Link to="/policies?tab=shipping" className="hover:text-white transition-colors">Shipping Policy</Link>
            <span>•</span>
            <Link to="/transparency" className="hover:text-white transition-colors">80G Exemption</Link>
            <span>•</span>
            <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
