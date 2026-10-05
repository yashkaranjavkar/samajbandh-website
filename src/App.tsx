/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { OurWorkPage } from './pages/OurWorkPage';
import { ProductsServicesPage } from './pages/ProductsServicesPage';
import { ImpactStoriesPage } from './pages/ImpactStoriesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { GetInvolvedPage } from './pages/GetInvolvedPage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { TransparencyPage } from './pages/TransparencyPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Modals
import { DonateModal } from './components/modals/DonateModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { ProgramDetailModal } from './components/modals/ProgramDetailModal';
import { RegistrationModal } from './components/modals/RegistrationModal';

import { Program, EventItem } from './types';
import { isSectionVisible } from './config/siteLayout';

// Scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

export default function App() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-slate-900 selection:text-white font-sans antialiased">
        
        {/* Global Navigation Header */}
        <Header 
          onOpenDonate={() => setIsDonateOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Main Content View */}
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  onOpenDonate={() => setIsDonateOpen(true)}
                  onOpenProgramDetail={(prog) => setSelectedProgram(prog)}
                  onOpenRegistration={(ev) => setSelectedEvent(ev)}
                />
              } 
            />
            <Route 
              path="/about" 
              element={<AboutPage onOpenDonate={() => setIsDonateOpen(true)} />} 
            />
            <Route 
              path="/our-work" 
              element={
                <OurWorkPage 
                  onOpenDonate={() => setIsDonateOpen(true)}
                  onOpenProgramDetail={(prog) => setSelectedProgram(prog)}
                />
              } 
            />
            <Route 
              path="/products-services" 
              element={<ProductsServicesPage onOpenDonate={() => setIsDonateOpen(true)} />} 
            />
            <Route 
              path="/impact" 
              element={<ImpactStoriesPage onOpenDonate={() => setIsDonateOpen(true)} />} 
            />
            <Route 
              path="/impact-stories" 
              element={<ImpactStoriesPage onOpenDonate={() => setIsDonateOpen(true)} />} 
            />
            <Route 
              path="/transparency" 
              element={<TransparencyPage onOpenDonate={() => setIsDonateOpen(true)} />} 
            />
            <Route 
              path="/policies" 
              element={<PoliciesPage onOpenDonate={() => setIsDonateOpen(true)} />} 
            />
            <Route 
              path="/resources" 
              element={<ResourcesPage onOpenDonate={() => setIsDonateOpen(true)} />} 
            />
            <Route 
              path="/get-involved" 
              element={<GetInvolvedPage onOpenDonate={() => setIsDonateOpen(true)} />} 
            />
            <Route 
              path="/news-events" 
              element={
                <NewsEventsPage 
                  onOpenDonate={() => setIsDonateOpen(true)}
                  onOpenRegistration={(ev) => setSelectedEvent(ev)}
                />
              } 
            />
            <Route 
              path="/gallery" 
              element={<GalleryPage onOpenDonate={() => setIsDonateOpen(true)} />} 
            />
            <Route 
              path="/contact" 
              element={<ContactPage onOpenDonate={() => setIsDonateOpen(true)} />} 
            />
            <Route 
              path="/admin" 
              element={<AdminDashboardPage />} 
            />
            
            {/* Fallback 404 Route */}
            <Route
              path="*"
              element={
                <div className="py-28 text-center max-w-lg mx-auto px-4 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-700 font-mono text-xl font-bold">
                    404
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Page Not Found</h2>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    The requested page could not be located. You can explore our verified field impact or return to the homepage.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <a
                      href="/"
                      className="inline-block px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm"
                    >
                      Back to Home
                    </a>
                    <a
                      href="/impact"
                      className="inline-block px-6 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all"
                    >
                      View Impact
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Global Footer (toggle in src/config/siteLayout.ts) */}
        {isSectionVisible('global', 'footer') && <Footer onOpenDonate={() => setIsDonateOpen(true)} />}

        {/* Global Modals */}
        <DonateModal 
          isOpen={isDonateOpen} 
          onClose={() => setIsDonateOpen(false)} 
        />

        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProgram={(slug) => {
            // Can trigger detail view if needed
          }}
        />

        <ProgramDetailModal
          program={selectedProgram}
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onOpenDonate={() => {
            setSelectedProgram(null);
            setIsDonateOpen(true);
          }}
        />

        <RegistrationModal
          eventItem={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />

      </div>
    </Router>
  );
}
