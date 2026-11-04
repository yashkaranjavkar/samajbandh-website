import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLiveRegistrations } from '../../hooks/useLiveRegistrations';

const TARGET_ID = 'upcoming-events';

interface Props {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
}

// /**
//  * Header item for event registration (scrolls to the Upcoming Events section on the Home page).
//  * - At least one event open: red blinking dot, clickable.
//  * - Nothing open: grey static dot, blurred and not clickable.
//  * Compact on purpose: only "Live" is shown until very wide screens, so the header keeps its room.
//  */
// export const LiveRegistrationLink: React.FC<Props> = ({ variant = 'desktop', onNavigate }) => {
//   const { openCount } = useLiveRegistrations();
//   const { pathname } = useLocation();
//   const live = openCount > 0;

//   const size = variant === 'mobile'
//     ? 'flex w-full justify-center py-3 px-3 rounded-2xl text-xs'
//     : 'hidden lg:inline-flex px-2.5 py-1.5 rounded-lg text-[10px]';

//   const dot = (
//     <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
//       {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />}
//       <span className={`relative inline-flex h-2 w-2 rounded-full ${live ? 'animate-pulse bg-red-600' : 'bg-slate-400'}`} />
//     </span>
//   );

//   const label = variant === 'mobile'
//     ? <span>Live Registrations</span>
//     : (<><span className="2xl:hidden">Live</span><span className="hidden 2xl:inline">Live Registrations</span></>);

//   if (!live) {
//     return (
//       <span
//         role="link"
//         aria-disabled="true"
//         aria-label="Live Registrations (closed right now)"
//         title="No event registrations are open right now"
//         className={`${size} items-center gap-1.5 border border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500 opacity-60 blur-[1.5px] select-none pointer-events-none cursor-not-allowed`}
//       >
//         {dot}{label}
//       </span>
//     );
//   }

//   const handleClick = (e: React.MouseEvent) => {
//     onNavigate?.();
//     // Already on the Home page: just scroll. Otherwise the link goes Home and App's ScrollToTop scrolls to the section.
//     const target = pathname === '/' ? document.getElementById(TARGET_ID) : null;
//     if (target) {
//       e.preventDefault();
//       target.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   return (
//     <Link
//       to={`/#${TARGET_ID}`}
//       onClick={handleClick}
//       aria-label={`Live Registrations: ${openCount} event${openCount === 1 ? '' : 's'} open`}
//       title={`${openCount} event${openCount === 1 ? '' : 's'} open for registration`}
//       className={`${size} items-center gap-1.5 border border-red-200 bg-red-50 font-bold uppercase tracking-wider text-red-700 transition-all hover:bg-red-100`}
//     >
//       {dot}{label}
//     </Link>
//   );
// };
// ------------------------------


export const LiveRegistrationLink: React.FC<Props> = ({
  variant = 'desktop',
  onNavigate,
}) => {
  const { openCount } = useLiveRegistrations();
  const { pathname } = useLocation();

  const live = openCount > 0;

  const size =
    variant === 'mobile'
      ? 'flex w-full justify-center py-3 px-3 rounded-2xl text-xs'
      : 'inline-flex px-2.5 py-2 rounded-lg text-[10px]';

  const dot = (
    <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
      {live && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
      )}
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
          live ? 'bg-red-600 animate-pulse' : 'bg-slate-400'
        }`}
      />
    </span>
  );

  const label = live ? 'Registrations Open' : 'Registrations Closed';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    if (pathname === '/') {
      const target = document.getElementById(TARGET_ID);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };

  return (
    <Link
      to={`/#${TARGET_ID}`}
      onClick={handleClick}
      aria-label={`${label}. ${openCount} event${openCount === 1 ? '' : 's'} open`}
      title={
        live
          ? `${openCount} event${openCount === 1 ? '' : 's'} open for registration`
          : 'No event registrations are currently open. View upcoming events.'
      }
      className={`${size} items-center gap-2 border font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] ${
        live
          ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
          : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
      }`}
    >
      {dot}
      <span>{label}</span>
    </Link>
  );
};

