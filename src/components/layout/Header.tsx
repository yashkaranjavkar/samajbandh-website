import React, { useState, useEffect } from 'react';
import { isSectionVisible } from '../../config/siteLayout';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  Heart, 
  ShoppingBag, 
  Users, 
  ChevronDown,
  Phone,
  FileCheck,
  Award,
  ShieldCheck,
  Layers,
  Factory,
  Home,
  GraduationCap,
  BarChart3,
  PackageCheck,
  Sparkles,
  Building,
  BookOpen,
  FileText,
  Calendar,
  Camera,
  HeartHandshake,
  Target,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  onOpenDonate: () => void;
  onOpenSearch: () => void;
  onOpenJoinUs?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDonate,
  onOpenSearch,
  onOpenJoinUs
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileAccordion(null);
  }, [location.pathname]);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Target': return <Target className="w-4 h-4 text-amber-500" />;
      case 'Users': return <Users className="w-4 h-4 text-blue-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'Phone': return <Phone className="w-4 h-4 text-amber-600" />;
      case 'Layers': return <Layers className="w-4 h-4 text-indigo-500" />;
      case 'Factory': return <Factory className="w-4 h-4 text-amber-600" />;
      case 'Award': return <Award className="w-4 h-4 text-emerald-600" />;
      case 'Home': return <Home className="w-4 h-4 text-rose-500" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'BarChart3': return <BarChart3 className="w-4 h-4 text-emerald-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-rose-500" />;
      case 'PackageCheck': return <PackageCheck className="w-4 h-4 text-emerald-600" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'Building': return <Building className="w-4 h-4 text-slate-700" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'FileText': return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'Calendar': return <Calendar className="w-4 h-4 text-indigo-500" />;
      case 'Camera': return <Camera className="w-4 h-4 text-purple-500" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4 text-rose-500" />;
      default: return <Sparkles className="w-4 h-4 text-emerald-500" />;
    }
  };

  const navLinks = [
    { 
      name: 'Home', 
      path: '/' 
    },
    { 
      name: 'About', 
      path: '/about',
      tagline: 'Genesis, Vision & Governance',
      description: 'Our origin story, leadership team, statutory compliance, and contact info.',
      subLinks: [
        { 
          name: 'Our Story & Genesis', 
          path: '/about', 
          desc: 'Born from maternal tribute, grounded in human dignity',
          icon: 'Heart'
        },
        { 
          name: 'Vision, Mission & Values', 
          path: '/about#vision', 
          desc: 'Guiding compass and systemic theory of change',
          icon: 'Target'
        },
        { 
          name: 'Governance & Team', 
          path: '/about#team', 
          desc: 'Board of trustees, field directors and advisory council',
          icon: 'Users'
        },
        { 
          name: 'Audited Transparency & 80G', 
          path: '/transparency', 
          desc: '12A, 80G certificates, CSR-1 approvals & annual audits',
          icon: 'ShieldCheck'
        },
        { 
          name: 'Contact & Regional Hubs', 
          path: '/contact', 
          desc: 'Pune HQ, tribal outreach centers and helpline',
          icon: 'Phone'
        }
      ]
    },
    { 
      name: 'Our Work', 
      path: '/our-work',
      tagline: 'Grassroots Ecosystem',
      description: 'Grassroots programs across menstrual literacy, livelihoods, and tribal reform.',
      subLinks: [
        { 
          name: 'All Programs Overview', 
          path: '/our-work', 
          desc: 'Educate, Engage & Sustain systemic framework',
          icon: 'Layers'
        },
        { 
          name: 'Asha Pad Micro-Centres', 
          path: '/our-work?category=livelihood', 
          desc: '15 decentralized women-led stitching hubs',
          icon: 'Factory'
        },
        { 
          name: 'Arogya Samwadak Fellowships', 
          path: '/our-work?category=fellowship', 
          desc: 'Youth health champions & village educators',
          icon: 'Award'
        },
        { 
          name: 'Tribal Rest Shed Reforms', 
          path: '/our-work?category=tribal-outreach', 
          desc: 'Kurma Sudhar safety infrastructure in Gadchiroli',
          icon: 'Home'
        },
        { 
          name: 'School & Adolescent Samata', 
          path: '/our-work?category=school-college', 
          desc: 'Gender-inclusive biological literacy modules',
          icon: 'GraduationCap'
        },
        { 
          name: 'Verified Impact & Telemetry', 
          path: '/impact', 
          desc: 'Longitudinal data, before/after indicators & voices',
          icon: 'BarChart3'
        }
      ]
    },
    { 
      name: 'Products & Services', 
      path: '/products-services',
      tagline: 'Eco-Friendly Dignity',
      description: 'Zero-plastic reusable cloth pads, health kits, and corporate workshops.',
      subLinks: [
        { 
          name: 'Asha Reusable Cloth Pads', 
          path: '/products-services', 
          desc: '5-layer leakproof design, 100+ washes, skin-safe',
          icon: 'ShoppingBag'
        },
        { 
          name: 'Period & Hygiene Kits', 
          path: '/products-services?tab=products', 
          desc: 'Complete kits for schools, institutions & CSR drives',
          icon: 'PackageCheck'
        },
        { 
          name: 'Master Trainer (ToT) Programs', 
          path: '/products-services?tab=workshops', 
          desc: 'Certifications for NGOs, educators & health workers',
          icon: 'Sparkles'
        },
        { 
          name: 'Corporate CSR & School Drives', 
          path: '/products-services?tab=workshops', 
          desc: 'Demystification workshops & bulk employee drives',
          icon: 'Building'
        }
      ]
    },
    { 
      name: 'Gallery', 
      path: '/gallery'
    },
    { 
      name: 'More', 
      path: '/resources',
      tagline: 'Resources & Participation',
      description: 'Toolkits, media coverage, volunteering, and donation options.',
      subLinks: [
        { 
          name: 'Knowledge & Toolkits', 
          path: '/resources', 
          desc: 'Open-access guides in Marathi, Hindi & English',
          icon: 'BookOpen'
        },
        { 
          name: 'Impact Stories & Voices', 
          path: '/impact', 
          desc: 'Documentary photo essays & community voices',
          icon: 'FileText'
        },
        { 
          name: 'News & Media Coverage', 
          path: '/news-events', 
          desc: 'Press mentions, awards, and upcoming workshops',
          icon: 'Calendar'
        },
        { 
          name: 'Volunteer & Internships (1 Wk - 3 Mo)', 
          path: '/get-involved', 
          desc: 'Flexible field drives, 1-week sprints & academic credit internships',
          icon: 'HeartHandshake'
        },
        { 
          name: 'Tax-Exempt 80G Giving', 
          path: '/get-involved#donate', 
          desc: 'Direct tax-exempt contribution to menstrual dignity',
          icon: 'Heart'
        }
      ]
    }
  ];

  const isActive = (target: string | { path: string; subLinks?: { path: string }[] }) => {
    const path = typeof target === 'string' ? target : target.path;
    const subLinks = typeof target === 'object' ? target.subLinks : undefined;

    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    if (subLinks && subLinks.some(sub => location.pathname === sub.path.split('#')[0].split('?')[0])) return true;
    return false;
  };

  return (
    <>
      {/* Top Notification / Trust Bar */}
      {isSectionVisible('global', 'topBar') && (
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 hidden lg:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
              Grassroots Action for Menstrual Dignity & Gender Equity
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Registered NGO | Section 80G Tax-Exempt Status
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <Link to="/transparency" className="hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md hover:bg-slate-800">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              Audited Transparency
            </Link>
            <span className="text-slate-600">•</span>
            <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md hover:bg-slate-800">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              Helpline: +91 98765 43210
            </Link>
          </div>
        </div>
      </div>
      )}

      {/* Main Sticky Navigation */}
      {isSectionVisible('global', 'header') && (
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80' 
            : 'bg-white border-b border-slate-200/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3.5 group shrink-0" id="main-logo-link">
              <img
                src="/images/brand/samajbandh-logo.png"
                alt="Samajbandh logo"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-md shadow-slate-900/10 group-hover:scale-105 transition-all"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                  SAMAJBANDH
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">
                  Empowering Dignity & Equity
                </span>
              </div>
            </Link>

            {/* Streamlined Desktop Navigation Links (Friendly Sections) */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-medium text-slate-700" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const active = isActive(link);
                const hasSub = link.subLinks && link.subLinks.length > 0;

                return (
                  <div 
                    key={link.name} 
                    className="relative group py-6"
                  >
                    <Link
                      to={link.path}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        active 
                          ? 'text-slate-900 bg-slate-100 font-black' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>{link.name}</span>
                      {hasSub && <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-800 group-hover:rotate-180 transition-transform" />}
                    </Link>

                    {/* Rich Subsections Dropdown Menu */}
                    {hasSub && (
                      <div className="absolute top-full left-0 w-80 xl:w-96 pt-1 hidden group-hover:block transition-all animate-in fade-in-50 slide-in-from-top-2 z-50">
                        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 p-3 space-y-1">
                          
                          {/* Dropdown Header Pill */}
                          <div className="px-3.5 py-2 mb-1 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {link.tagline}
                            </span>
                            <Link 
                              to={link.path} 
                              className="text-[10px] font-bold text-[#C85A32] hover:underline flex items-center gap-0.5"
                            >
                              <span>Explore All</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                          </div>

                          {/* Sublinks with Icons & Descriptions */}
                          <div className="space-y-1">
                            {link.subLinks!.map((sub) => (
                              <Link
                                key={sub.name}
                                to={sub.path}
                                className="group/item flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                              >
                                <div className="p-2 rounded-xl bg-slate-100 group-hover/item:bg-white group-hover/item:shadow-xs transition-colors shrink-0 mt-0.5">
                                  {renderIcon(sub.icon)}
                                </div>
                                <div className="space-y-0.5">
                                  <div className="text-xs font-bold text-slate-900 group-hover/item:text-[#C85A32] transition-colors leading-snug">
                                    {sub.name}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    {sub.desc}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Actions: Search, Shop, Volunteer, Donate */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Search Toggle */}
              <button
                id="search-toggle-btn"
                onClick={onOpenSearch}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden border border-transparent hover:border-slate-200"
                aria-label="Search content"
                title="Search (Ctrl + K)"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Shop CTA */}
              <Link
                id="header-shop-btn"
                to="/products-services"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-all border border-slate-200"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
                <span>Shop Pads</span>
              </Link>

              {/* Volunteer CTA */}
              <Link
                id="header-volunteer-btn"
                to="/get-involved"
                className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-200/80"
              >
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>Volunteer / Intern</span>
              </Link>

              {/* Primary Donate CTA */}
              <button
                id="header-donate-btn"
                onClick={onOpenDonate}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#C85A32] text-white hover:bg-[#b54c26] shadow-md shadow-rose-900/10 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-hidden"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Donate</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden border border-slate-200"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Accordion Subsections */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="px-4 pt-4 pb-6 space-y-3 max-h-[85vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
                <Link
                  to="/products-services"
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 uppercase tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingBag className="w-4 h-4 text-[#C85A32]" />
                  <span>Shop Pads</span>
                </Link>
                <Link
                  to="/get-involved"
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-900 uppercase tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Volunteer / Intern</span>
                </Link>
              </div>

              <div className="space-y-1 divide-y divide-slate-100">
                {navLinks.map((link) => {
                  const active = isActive(link);
                  const isExpanded = openMobileAccordion === link.name;

                  return (
                    <div key={link.name} className="pt-2">
                      <div className="flex items-center justify-between">
                        <Link
                          to={link.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex-1 text-sm font-bold py-2.5 px-3 rounded-xl ${
                            active ? 'text-slate-900 bg-slate-100 font-black' : 'text-slate-800'
                          }`}
                        >
                          {link.name}
                        </Link>
                        {link.subLinks && (
                          <button
                            onClick={() => setOpenMobileAccordion(isExpanded ? null : link.name)}
                            className="p-2.5 text-slate-500 hover:text-slate-900"
                            aria-label={`Toggle ${link.name} submenu`}
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-slate-900' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Expanded Sublinks */}
                      {isExpanded && link.subLinks && (
                        <div className="pl-3 pr-1 py-2 space-y-1.5 border-l-2 border-slate-200 ml-3 my-1">
                          {link.subLinks.map((sub) => (
                            <Link
                              key={sub.name}
                              to={sub.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-start gap-2.5 py-2 px-2.5 rounded-xl hover:bg-slate-50 text-xs"
                            >
                              <span className="mt-0.5">{renderIcon(sub.icon)}</span>
                              <div>
                                <div className="font-bold text-slate-900">{sub.name}</div>
                                <div className="text-[10px] text-slate-500 font-medium leading-tight">{sub.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenDonate();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#C85A32] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Support Samajbandh (Donate 80G)</span>
                </button>
                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium pt-1">
                  <Link to="/transparency" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">
                    Audited Reports
                  </Link>
                  <span>•</span>
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">
                    Contact Us
                  </Link>
                  <span>•</span>
                  <Link to="/policies" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">
                    Policies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      )}
    </>
  );
};
