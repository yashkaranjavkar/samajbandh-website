import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SectionHeading } from '../components/common/SectionHeading';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { BulkOrderModal } from '../components/modals/BulkOrderModal';
import { PRODUCTS_DATA, WORKSHOPS_SERVICES } from '../data/mockData';
import { 
  ShoppingBag, 
  Layers, 
  Sun, 
  Droplet, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  PackageCheck,
  Building,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface ProductsServicesPageProps {
  onOpenDonate: () => void;
}

export const ProductsServicesPage: React.FC<ProductsServicesPageProps> = ({
  onOpenDonate
}) => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [selectedProductForBulk, setSelectedProductForBulk] = useState('Asha Reusable Cloth Pads');
  const [activeTab, setActiveTab] = useState<'products' | 'workshops' | 'care-guide'>('products');

  useEffect(() => {
    if (tabParam === 'products' || tabParam === 'workshops' || tabParam === 'care-guide') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const mainPad = PRODUCTS_DATA[0];

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="productsServices"
        sections={{
          // 8.1 HERO PRODUCT SPOTLIGHT
          hero: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Asha Cloth Pads Hero">
              <div className="bg-[#143D2B] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-emerald-800">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-[#D99B26]" />
                      <span>Zero-Plastic • 100+ Washes • Skin Safe</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-heading font-extrabold text-white leading-tight">
                      Asha Reusable Cloth Pads: Empowering Women & The Earth
                    </h1>

                    <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
                      Handcrafted by rural women artisans across 15 decentralized micro-production centres. Engineered with 5 precision layers for 8-hour leak-proof absorbency, certified chemical-free, and reusable for over 3 years.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15">
                        <span className="text-xl font-bold font-serif-heading text-[#D99B26] block">₹280</span>
                        <span className="text-xs text-emerald-200">Pack of 4 Pads + Pouch</span>
                      </div>
                      <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15">
                        <span className="text-xl font-bold font-serif-heading text-emerald-300 block">3+ Years</span>
                        <span className="text-xs text-emerald-200">Life Span (100+ Washes)</span>
                      </div>
                      <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15">
                        <span className="text-xl font-bold font-serif-heading text-[#C85A32] block">₹4,500+</span>
                        <span className="text-xs text-emerald-200">Saved per menstruator</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-4">
                      <button
                        onClick={() => {
                          setSelectedProductForBulk(mainPad.title);
                          setIsBulkOpen(true);
                        }}
                        className="px-7 py-3.5 rounded-xl bg-[#C85A32] hover:bg-[#B84A28] text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Order Retail / Bulk Packs</span>
                      </button>
                      <button
                        onClick={onOpenDonate}
                        className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4 fill-white" />
                        <span>Sponsor Pads for Rural Schoolgirls</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-700/60 bg-black/40">
                      <img
                        src={mainPad.images[0]}
                        alt="Asha Reusable Cloth Pads"
                        className="w-full h-96 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-xs p-3 rounded-xl text-white text-xs flex justify-between items-center">
                        <span>SITRA Tested 5-Layer System</span>
                        <span className="text-emerald-300 font-bold">100% Skin Safe</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          ),

          // 8.2 ANATOMICAL 5-LAYER BREAKDOWN DIAGRAM
          padLayers: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Pad Technology and Layer Diagram">
              <SectionHeading
                eyebrow="Medical & Material Science"
                title="Inside the Asha Cloth Pad Architecture"
                subtitle="Engineered for maximum absorbency, rapid drying, rash-free breathability, and zero plastic toxicity."
                centered
              />

              <div className="bg-[#FBF9F5] rounded-3xl p-8 sm:p-12 border border-[#E5DFC5] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="text-xl font-serif-heading font-bold text-[#143D2B]">
                    The 5 Precision Protective Layers
                  </h3>

                  <div className="space-y-3">
                    {[
                      { layer: 'Layer 1 (Top Skin-Contact)', title: '100% Breathable Unbleached Cotton', desc: 'Soft, hypoallergenic, skin-friendly surface preventing rashes, heat boils, and vaginal itching.' },
                      { layer: 'Layer 2 & 3 (Absorptive Core)', title: 'High-Density Organic Cotton Flannel', desc: 'Double-woven hydrophilic cotton cores locking in menstrual flow instantly without chemical gelling polymers.' },
                      { layer: 'Layer 4 (Waterproof Barrier)', title: 'Medical-Grade Breathable PUL Barrier', desc: 'Ultra-thin, polyurethane laminated sheet preventing leaks onto outer garments while allowing vapor airflow.' },
                      { layer: 'Layer 5 (Base & Wings)', title: 'Reinforced Cotton Shell with Nickel-Free Snaps', desc: 'Ergonomic wrap-around wings that snap firmly around regular undergarments without slipping.' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white border border-[#E5DFC5] shadow-2xs space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#C85A32] tracking-wider block">
                          {item.layer}
                        </span>
                        <h4 className="text-sm font-bold text-[#1F2421]">{item.title}</h4>
                        <p className="text-xs text-[#5C6760] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-6">
                  <div className="relative rounded-2xl overflow-hidden border border-[#E5DFC5] shadow-lg">
                    <img
                      src="/images/products/asha-menstrual-kit.jpg"
                      alt="Cloth pad anatomy"
                      className="w-full h-80 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex items-end p-5 text-white">
                      <div>
                        <span className="text-xs font-bold uppercase text-emerald-300">Lab Tested</span>
                        <h4 className="text-sm font-semibold">Zero Dioxins • Zero Synthetic Fragrances • Zero Bleach</h4>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#143D2B] space-y-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Dermatologically & Clinically Safe
                    </span>
                    <p className="text-[#143D2B]/90">
                      Unlike commercial pads containing dioxins, synthetic perfumes, and plastic backings that cause sweating and microbial growth, Asha cloth pads allow natural respiration.
                    </p>
                  </div>
                </div>

              </div>
            </section>
          ),

          // 8.3 WASHING, CARE & DRYING PROTOCOL GUIDE
          washingGuide: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Washing and Care Guide">
              <SectionHeading
                eyebrow="Hygiene Mastery"
                title="Simple 4-Step Washing & Care Protocol"
                subtitle="Scientifically proven hygiene instructions for long-lasting, germ-free cloth pad reuse."
                centered
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: 'Step 1: Cold Soak',
                    title: '30-Min Cold Water Soak',
                    desc: 'Soak used pads in regular cold water. Cold water loosens protein-based blood stains instantly without setting them into the fabric.',
                    icon: <Droplet className="w-6 h-6 text-[#143D2B]" />
                  },
                  {
                    step: 'Step 2: Gentle Rub',
                    title: 'Wash with Regular Soap',
                    desc: 'Gently lather with standard laundry soap or detergent. Avoid harsh bleaches or fabric softeners which degrade absorbency.',
                    icon: <ShieldCheck className="w-6 h-6 text-[#C85A32]" />
                  },
                  {
                    step: 'Step 3: Sun Dry',
                    title: 'Dry in Direct Sunlight',
                    desc: 'Hang under direct open sunlight. Ultraviolet (UV) rays act as a powerful natural disinfectant killing 99.9% of bacteria.',
                    icon: <Sun className="w-6 h-6 text-[#D99B26]" />
                  },
                  {
                    step: 'Step 4: Clean Store',
                    title: 'Store in Breathable Pouch',
                    desc: 'Once fully dried, fold and keep in a dry, ventilated cotton pouch or closet drawer ready for the next menstrual cycle.',
                    icon: <CheckCircle2 className="w-6 h-6 text-[#87986A]" />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E5DFC5] shadow-xs space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FBF9F5] border border-[#E5DFC5] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#87986A] block">
                      {item.step}
                    </span>
                    <h4 className="text-base font-bold text-[#1F2421]">{item.title}</h4>
                    <p className="text-xs text-[#5C6760] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ),

          // 8.4 ALL PRODUCTS & KITS GRID
          productsCatalog: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Products Catalog">
              <SectionHeading
                eyebrow="Catalog & Kits"
                title="Products, School Kits & Menstrual Relief Packs"
                subtitle="Explore individual and institutional options designed for schools, tribal clusters, and disaster relief."
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PRODUCTS_DATA.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E5DFC5] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {product.badge && (
                          <div className="absolute top-3 left-3 bg-[#C85A32] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                            {product.badge}
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-xl text-sm font-bold text-[#143D2B] shadow-sm">
                          ₹{product.price}
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-lg font-serif-heading font-bold text-[#1F2421]">
                            {product.title}
                          </h3>
                          <p className="text-xs text-[#5C6760] mt-1">{product.subtitle}</p>
                        </div>

                        <p className="text-xs text-[#5C6760] leading-relaxed">
                          {product.description}
                        </p>

                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-bold uppercase text-[#143D2B] block">Kit Contents:</span>
                          {product.features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-[#1F2421]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#143D2B] shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 space-y-2">
                      <div className="pt-4 border-t border-[#E5DFC5] flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProductForBulk(product.title);
                            setIsBulkOpen(true);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-[#143D2B] hover:bg-[#1E533B] text-white font-bold text-xs transition-colors"
                        >
                          Order / Inquire
                        </button>
                        <button
                          onClick={onOpenDonate}
                          className="flex-1 py-2.5 rounded-xl border border-[#C85A32] text-[#C85A32] hover:bg-[#C85A32]/10 font-bold text-xs transition-colors"
                        >
                          Sponsor This Kit
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </section>
          ),

          // 8.6 WORKSHOPS & INSTITUTIONAL TRAINING SERVICES
          workshopsTraining: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Workshops and Training Services">
              <div className="bg-[#1B4332] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
                <SectionHeading
                  eyebrow="Training & Institutional Capacity"
                  title="Workshops, Training of Trainers & Corporate MHM Programs"
                  subtitle="Engage our certified master trainers to educate employees, students, or field health workers."
                  light
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {WORKSHOPS_SERVICES.map((serv) => (
                    <div key={serv.id} className="p-6 rounded-2xl bg-[#143D2B] border border-emerald-700/60 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99B26] block">
                          {serv.clientType}
                        </span>
                        <h4 className="text-lg font-serif-heading font-bold text-white">
                          {serv.title}
                        </h4>
                        <p className="text-xs text-emerald-100/80 leading-relaxed">
                          {serv.description}
                        </p>
                        <div className="pt-2 text-xs text-emerald-300 font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Duration: {serv.duration}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProductForBulk(`Workshop Booking: ${serv.title}`);
                          setIsBulkOpen(true);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B84A28] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Book Workshop for Your Org</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ),

          // 8.7 DECENTRALIZED MANUFACTURING & FAIR LIVING WAGES
          manufacturing: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Decentralized Manufacturing">
              <div className="bg-[#FBF9F5] rounded-3xl p-8 sm:p-12 border border-[#E5DFC5] space-y-6">
                <SectionHeading
                  eyebrow="Economic Justice"
                  title="The Decentralized Micro-Manufacturing Model"
                  subtitle="How every pad stitched sustains local rural women with living wages and leadership dignity."
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-white border border-[#E5DFC5] space-y-2">
                    <span className="text-xl font-bold font-serif-heading text-[#143D2B] block">95+ Women Artisans</span>
                    <h4 className="text-sm font-bold text-[#1F2421]">Fair Piece-Rate & Living Wages</h4>
                    <p className="text-xs text-[#5C6760] leading-relaxed">
                      Artisans earn directly above standard regional minimum wage standards, providing independent income for family nutrition and children’s education.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-[#E5DFC5] space-y-2">
                    <span className="text-xl font-bold font-serif-heading text-[#C85A32] block">15 Micro-Centres</span>
                    <h4 className="text-sm font-bold text-[#1F2421]">Self-Help Group Ownership</h4>
                    <p className="text-xs text-[#5C6760] leading-relaxed">
                      Rather than centralized factory automation, micro-centres are situated right inside rural villages, eliminating travel stress for mothers.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-[#E5DFC5] space-y-2">
                    <span className="text-xl font-bold font-serif-heading text-[#87986A] block">Zero Waste Upcycling</span>
                    <h4 className="text-sm font-bold text-[#1F2421]">Clean Offcut Repurposing</h4>
                    <p className="text-xs text-[#5C6760] leading-relaxed">
                      Trimmings and excess cotton fabric from pad cutting are repurposed into sanitary carrying pouches, baby bibs, and quilt fillings.
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

      {/* Bulk Order Modal */}
      <BulkOrderModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        defaultItem={selectedProductForBulk}
      />

    </div>
  );
};
