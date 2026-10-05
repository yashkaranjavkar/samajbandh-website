import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp, Shield, Sparkles, Building, Heart } from 'lucide-react';

interface OrganogramNode {
  id: string;
  role: string;
  subtitle: string;
  description: string;
  membersCount?: string;
  category: 'board' | 'advisory' | 'leadership' | 'core' | 'regional' | 'grassroots';
  children?: OrganogramNode[];
}

const ORG_TREE: OrganogramNode = {
  id: 'board-tier',
  role: 'Board of Trustees',
  subtitle: 'Legal Governance, Statutory Compliance & Ethical Custodianship',
  description: 'Composed of experienced public health specialists, social development leaders, and legal counsels guiding institutional fidelity, 80G/12A compliance, and financial audits.',
  membersCount: '3 Trustees',
  category: 'board',
  children: [
    {
      id: 'advisory-tier',
      role: 'Advisory Board',
      subtitle: 'Strategic Counsel on Health Policy, Tribal Rights & CSR Partnerships',
      description: 'Senior mentors providing guidance on epidemiological research, tribal community mediation, and corporate ESG alignments.',
      membersCount: '4 Honorary Advisors',
      category: 'advisory',
      children: [
        {
          id: 'leadership-tier',
          role: 'Executive Leadership & Founder',
          subtitle: 'Sachin Asha Subhash (Founder & Managing Trustee)',
          description: 'Grassroots vision-keeper driving field program architecture, Gaokor rest shed mediation, and decentralized production scaling.',
          category: 'leadership',
          children: [
            {
              id: 'programs-wing',
              role: 'Programs & Fellowship Directorate',
              subtitle: 'Pooja Gaikwad (Head of Programs)',
              description: 'Manages Arogya Samwadak Fellowships, School & College Samata curriculum, and ToT master trainings.',
              membersCount: '6 Program Officers',
              category: 'core',
              children: [
                {
                  id: 'fellows-network',
                  role: 'Arogya Samwadak Fellows & Coordinators',
                  subtitle: '140+ Active Grassroots Health Champions',
                  description: 'Trained local youth conducting weekly village circles, adolescent counseling, and Anganwadi linkages.',
                  membersCount: '140+ Fellows',
                  category: 'grassroots'
                }
              ]
            },
            {
              id: 'production-wing',
              role: 'Decentralized Production & Livelihoods',
              subtitle: 'Anil Sonawane (Head of Production & QA)',
              description: 'Supervises raw fabric sourcing, artisan skill upgrades, zero-waste cutting patterns, and strict sanitary sterilization.',
              membersCount: '4 Technical Supervisors',
              category: 'core',
              children: [
                {
                  id: 'shg-artisans',
                  role: 'SHG Women Artisan Collectives',
                  subtitle: '15 Decentralized Micro-Units (95+ Tailors)',
                  description: 'Self-Help Group members stitching, inspecting, and packaging Asha reusable cloth pads with fair living wages.',
                  membersCount: '95+ Artisans',
                  category: 'grassroots'
                }
              ]
            },
            {
              id: 'advocacy-wing',
              role: 'Research, Advocacy & Tribal Outreach',
              subtitle: 'Field Research & Gaokor Mediation Desk',
              description: 'Leads community consensus dialogues with tribal councils, epidemiological surveys, and state health white papers.',
              membersCount: '4 Field Researchers',
              category: 'core',
              children: [
                {
                  id: 'volunteer-network',
                  role: 'Samajbandh Volunteer Network',
                  subtitle: '300+ Active Youth & Medical Volunteers',
                  description: 'Supporting health camps, school kit packaging drives, cloth donation sorting, and digital awareness.',
                  membersCount: '300+ Volunteers',
                  category: 'grassroots'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const Organogram: React.FC = () => {
  const [activeTier, setActiveTier] = useState<string>('leadership-tier');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E5DFC5] shadow-md space-y-8">
      
      {/* Introduction Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFC5] pb-6">
        <div>
          <span className="text-xs uppercase font-bold text-[#87986A] tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" />
            Institutional Governance & Field Hierarchy
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#143D2B] mt-1">
            Samajbandh Organizational Structure
          </h3>
          <p className="text-xs sm:text-sm text-[#5C6760] mt-1">
            A transparent, participatory governance framework connecting trustees with decentralized grassroots women artisans.
          </p>
        </div>
      </div>

      {/* Interactive Visual Organogram View */}
      <div className="space-y-6">
        
        {/* Tier 1: Board of Trustees */}
        <div className="flex flex-col items-center">
          <div 
            onClick={() => setActiveTier('board-tier')}
            className={`w-full max-w-xl p-4 sm:p-5 rounded-2xl border text-center cursor-pointer transition-all ${
              activeTier === 'board-tier'
                ? 'bg-[#143D2B] text-white shadow-lg border-[#143D2B] ring-4 ring-[#143D2B]/15'
                : 'bg-[#FBF9F5] text-[#1F2421] border-[#E5DFC5] hover:border-[#143D2B]/40'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#D99B26]" />
              <h4 className="text-base sm:text-lg font-serif-heading font-bold">
                Board of Trustees
              </h4>
            </div>
            <p className={`text-xs ${activeTier === 'board-tier' ? 'text-emerald-100' : 'text-[#5C6760]'}`}>
              Legal Governance, Compliance (80G/12A/FCRA) & Fiduciary Oversight
            </p>
          </div>

          <div className="w-0.5 h-6 bg-[#E5DFC5]"></div>

          {/* Tier 2: Advisory Board */}
          <div 
            onClick={() => setActiveTier('advisory-tier')}
            className={`w-full max-w-lg p-4 rounded-2xl border text-center cursor-pointer transition-all ${
              activeTier === 'advisory-tier'
                ? 'bg-[#1B4332] text-white shadow-lg border-[#1B4332] ring-4 ring-[#1B4332]/15'
                : 'bg-[#FBF9F5] text-[#1F2421] border-[#E5DFC5] hover:border-[#143D2B]/40'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#C85A32]" />
              <h4 className="text-sm sm:text-base font-serif-heading font-bold">
                Advisory Board
              </h4>
            </div>
            <p className={`text-xs ${activeTier === 'advisory-tier' ? 'text-emerald-100' : 'text-[#5C6760]'}`}>
              Public Health, Tribal Rights & CSR Strategic Guidance
            </p>
          </div>

          <div className="w-0.5 h-6 bg-[#E5DFC5]"></div>

          {/* Tier 3: Founder & Executive Leadership */}
          <div 
            onClick={() => setActiveTier('leadership-tier')}
            className={`w-full max-w-md p-4.5 rounded-2xl border text-center cursor-pointer transition-all ${
              activeTier === 'leadership-tier'
                ? 'bg-[#C85A32] text-white shadow-xl border-[#C85A32] ring-4 ring-[#C85A32]/20'
                : 'bg-amber-50 text-[#1F2421] border-amber-200 hover:border-[#C85A32]'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${activeTier === 'leadership-tier' ? 'text-amber-200' : 'text-[#C85A32]'}`}>
              Executive Leadership
            </span>
            <h4 className="text-base sm:text-lg font-serif-heading font-bold mt-0.5">
              Sachin Asha Subhash
            </h4>
            <p className={`text-xs ${activeTier === 'leadership-tier' ? 'text-amber-100' : 'text-[#5C6760]'}`}>
              Founder & Managing Trustee (MSW, TISS)
            </p>
          </div>

          <div className="w-0.5 h-6 bg-[#E5DFC5]"></div>

          {/* Tier 4: Functional Core Wings */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* Wing 1 */}
            <div 
              onClick={() => setActiveTier('programs-wing')}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                activeTier === 'programs-wing'
                  ? 'bg-emerald-50 border-[#143D2B] ring-2 ring-[#143D2B]'
                  : 'bg-[#FBF9F5] border-[#E5DFC5] hover:border-gray-400'
              }`}
            >
              <h5 className="text-sm font-bold text-[#143D2B]">
                Programs & Fellowships
              </h5>
              <p className="text-xs text-[#5C6760] mt-1">
                Arogya Samwadak Fellowship, School Samata & ToT Certifications
              </p>
              <div className="mt-3 pt-3 border-t border-[#E5DFC5] text-xs font-semibold text-[#C85A32]">
                ↓ 140+ Arogya Samwadak Fellows
              </div>
            </div>

            {/* Wing 2 */}
            <div 
              onClick={() => setActiveTier('production-wing')}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                activeTier === 'production-wing'
                  ? 'bg-emerald-50 border-[#143D2B] ring-2 ring-[#143D2B]'
                  : 'bg-[#FBF9F5] border-[#E5DFC5] hover:border-gray-400'
              }`}
            >
              <h5 className="text-sm font-bold text-[#143D2B]">
                Asha Production & Livelihoods
              </h5>
              <p className="text-xs text-[#5C6760] mt-1">
                Decentralized Micro-Centres, Sourcing & Technical Quality Control
              </p>
              <div className="mt-3 pt-3 border-t border-[#E5DFC5] text-xs font-semibold text-[#C85A32]">
                ↓ 15 SHG Units / 95+ Women Artisans
              </div>
            </div>

            {/* Wing 3 */}
            <div 
              onClick={() => setActiveTier('advocacy-wing')}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                activeTier === 'advocacy-wing'
                  ? 'bg-emerald-50 border-[#143D2B] ring-2 ring-[#143D2B]'
                  : 'bg-[#FBF9F5] border-[#E5DFC5] hover:border-gray-400'
              }`}
            >
              <h5 className="text-sm font-bold text-[#143D2B]">
                Tribal Reforms & Volunteer Desk
              </h5>
              <p className="text-xs text-[#5C6760] mt-1">
                Kurma Sudhar Karykram, White Papers & Statewide Volunteer Drives
              </p>
              <div className="mt-3 pt-3 border-t border-[#E5DFC5] text-xs font-semibold text-[#C85A32]">
                ↓ 300+ Volunteers Across Maharashtra
              </div>
            </div>

          </div>

        </div>

        {/* Selected Tier Explanatory Detail Card */}
        <div className="p-5 rounded-2xl bg-[#F4EFE6] border border-[#E5DFC5] flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#143D2B] text-white flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#143D2B]">
              Democratic, Grassroots-First Philosophy
            </h4>
            <p className="text-xs text-[#5C6760] mt-1 leading-relaxed">
              Every production micro-unit operates as a cooperative node where local women tailors maintain leadership over daily workflow and local pricing decisions. Field fellows in tribal areas are selected directly from the indigenous community to ensure deep cultural respect and long-term trust.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
