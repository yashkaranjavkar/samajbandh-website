import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

// UN Sustainable Development Goals that Samajbandh's programs contribute to.
// `icon` is the official UN SDG tile (public/images/sdg); `photo` is a Samajbandh field photo for that goal.
const SDG_GOALS = [
  {
    number: 3,
    title: 'Good Health & Well-being',
    icon: '/images/sdg/sdg-3.jpg',
    photo: '/images/awareness/asha-worker-training.jpg',
    target: 'Target 3.7',
    contribution: 'Menstrual health education, Arogya Samwadak fellows and ASHA worker training that reduce reproductive tract infections.'
  },
  {
    number: 4,
    title: 'Quality Education',
    icon: '/images/sdg/sdg-4.jpg',
    photo: '/images/awareness/school-girls-session.jpg',
    target: 'Target 4.5',
    contribution: 'School and adolescent sessions that keep girls in class through puberty instead of missing days every month.'
  },
  {
    number: 5,
    title: 'Gender Equality',
    icon: '/images/sdg/sdg-5.jpg',
    photo: '/images/samata-yatra/gender-equality-school.jpg',
    target: 'Target 5.1',
    contribution: 'Breaking period stigma and reforming discriminatory Gaokor / Kurma seclusion practices in tribal Gadchiroli.'
  },
  {
    number: 6,
    title: 'Clean Water & Sanitation',
    icon: '/images/sdg/sdg-6.jpg',
    photo: '/images/kurma/kurma-hut-interior.jpg',
    target: 'Target 6.2',
    contribution: 'Safe menstrual hygiene management for women and girls, including washing, sun-drying and safe rest-shed facilities.'
  },
  {
    number: 8,
    title: 'Decent Work & Economic Growth',
    icon: '/images/sdg/sdg-8.jpg',
    photo: '/images/kurma/tailoring-training-unit.jpg',
    target: 'Target 8.5',
    contribution: 'Women-led Asha pad micro-centres that provide fair-wage stitching livelihoods in rural communities.'
  },
  {
    number: 10,
    title: 'Reduced Inequalities',
    icon: '/images/sdg/sdg-10.jpg',
    photo: '/images/stories/gadchiroli-tribal-awareness.jpg',
    target: 'Target 10.2',
    contribution: 'Reaching tribal and remote villages that are often left out of mainstream health and hygiene services.'
  },
  {
    number: 12,
    title: 'Responsible Consumption & Production',
    icon: '/images/sdg/sdg-12.jpg',
    photo: '/images/products/asha-menstrual-kit.jpg',
    target: 'Target 12.5',
    contribution: 'Reusable 100% cotton cloth pads that replace single-use plastic pads and cut village waste.'
  },
  {
    number: 17,
    title: 'Partnerships for the Goals',
    icon: '/images/sdg/sdg-17.jpg',
    photo: '/images/awareness/community-health-dialogue.jpg',
    target: 'Target 17.17',
    contribution: 'Working with schools, gram panchayats, health workers and CSR partners to scale menstrual dignity.'
  }
];

export const SdgGoals: React.FC = () => {
  return (
    <section className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm" aria-label="Sustainable Development Goals">
      <SectionHeading
        eyebrow="Global Commitment"
        title="Our Contribution to the UN SDGs"
        subtitle="Every Samajbandh program is aligned with the United Nations Sustainable Development Goals (2030 Agenda)."
        centered
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {SDG_GOALS.map((goal) => (
          <div
            key={goal.number}
            className="group rounded-[2rem] border border-slate-200 bg-white overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-md transition-all"
          >
            {/* Field photo with the official SDG tile on top */}
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img
                src={goal.photo}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
              />
              <img
                src={goal.icon}
                alt={`SDG ${goal.number}: ${goal.title}`}
                loading="lazy"
                className="absolute left-4 bottom-4 w-28 h-28 shadow-lg"
              />
            </div>

            <div className="p-5 space-y-2 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                SDG {goal.target}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {goal.contribution}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a
          href="https://sdgs.un.org/goals"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#C85A32] transition-colors"
        >
          <span>Learn about the 17 UN SDGs</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
