import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp, Shield, Sparkles, Building, Heart } from 'lucide-react';
import {ORG_TREE} from "../../data/mockData"


interface OrganogramNode {
  id: string;
  role: string;
  subtitle: string;
  description: string;
  membersCount?: string;
  category:string;
  children?: OrganogramNode[];
}

// category
//     | 'board'
//     | 'advisory'
//     | 'leadership'
//     | 'core'
//     | 'regional'
//     | 'grassroots';

// --------------------------------------------------
// ORGANOGRAM DATA
// Update this object to add, remove, or edit nodes.
// --------------------------------------------------

const ORG_TREE_STRUCT: OrganogramNode = ORG_TREE 

// --------------------------------------------------
// CATEGORY STYLES
// --------------------------------------------------

const categoryStyles: Record<
  OrganogramNode['category'],
  {
    card: string;
    badge: string;
    dot: string;
  }
> = {
  board: {
    card: 'bg-[#143D2B] text-white border-[#143D2B]',
    badge: 'bg-white/15 text-white',
    dot: 'bg-white',
  },
  advisory: {
    card: 'bg-[#244F3B] text-white border-[#244F3B]',
    badge: 'bg-white/15 text-white',
    dot: 'bg-white',
  },
  leadership: {
    card: 'bg-[#C85A32] text-white border-[#C85A32]',
    badge: 'bg-white/20 text-white',
    dot: 'bg-white',
  },
  core: {
    card: 'bg-[#FBF9F5] text-[#143D2B] border-[#E5DFC5]',
    badge: 'bg-[#E8EFE9] text-[#143D2B]',
    dot: 'bg-[#C85A32]',
  },
  regional: {
    card: 'bg-[#EDF5EF] text-[#143D2B] border-[#C9DCCB]',
    badge: 'bg-[#D8E9DA] text-[#143D2B]',
    dot: 'bg-[#3D8056]',
  },
  grassroots: {
    card: 'bg-[#FFF4E8] text-[#493522] border-[#EAD5B8]',
    badge: 'bg-[#F5E3CC] text-[#79512A]',
    dot: 'bg-[#C78A3B]',
  },
};

// --------------------------------------------------
// RECURSIVE ORGANOGRAM NODE
// --------------------------------------------------

interface OrganogramTreeNodeProps {
  node: OrganogramNode;
  activeTier: string;
  onSelect: (id: string) => void;
}

const OrganogramTreeNode: React.FC<OrganogramTreeNodeProps> = ({
  node,
  activeTier,
  onSelect,
}) => {
  const styles = categoryStyles[node.category];
  const isActive = activeTier === node.id;
  const hasChildren = Boolean(node.children?.length);

  return (
    <div className="flex flex-col items-center w-full min-w-0">
      {/* Node card */}
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        aria-pressed={isActive}
        className={`
          relative w-full max-w-[340px] min-h-[150px]
          rounded-2xl border p-5 text-left
          shadow-sm transition-all duration-200
          hover:-translate-y-1 hover:shadow-lg
          focus:outline-none focus:ring-2
          focus:ring-[#C85A32] focus:ring-offset-2
          ${styles.card}
          ${isActive ? 'ring-2 ring-[#C85A32] ring-offset-2 shadow-lg' : ''}
        `}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 min-w-0">
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`}
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-snug">
                {node.role}
              </h3>
            </div>
          </div>

          {hasChildren && (
            <span className="shrink-0 text-xs opacity-75">
              {node.children?.length} {node.children?.length === 1 ? 'unit' : 'units'}
            </span>
          )}
        </div>

        <p className="mt-2 text-sm font-medium opacity-90">
          {node.subtitle}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${styles.badge}`}
          >
            {node.category}
          </span>

          {node.membersCount && (
            <span className="text-xs opacity-80">
              {node.membersCount}
            </span>
          )}
        </div>
      </button>

      {/* Child nodes */}
      {hasChildren && (
        <>
          {/* Vertical connector */}
          <div className="h-7 w-px bg-[#C9C3B4]" />

          {/* Children */}
          <div className="relative w-full">
            {node.children!.length > 1 && (
              <div className="absolute left-[10%] right-[10%] top-0 h-px bg-[#C9C3B4]" />
            )}

            <div
              className={`
                grid grid-cols-1 gap-6 pt-0
                ${node.children!.length === 2 ? 'md:grid-cols-2' : ''}
                ${node.children!.length >= 3 ? 'md:grid-cols-2 xl:grid-cols-3' : ''}
              `}
            >
              {node.children!.map((child) => (
                <div
                  key={child.id}
                  className="relative flex min-w-0 flex-col items-center"
                >
                  {/* Connector to child */}
                  {node.children!.length > 1 && (
                    <div className="h-6 w-px bg-[#C9C3B4]" />
                  )}

                  <OrganogramTreeNode
                    node={child}
                    activeTier={activeTier}
                    onSelect={onSelect}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --------------------------------------------------
// FIND SELECTED NODE
// --------------------------------------------------

const findNode = (
  node: OrganogramNode,
  id: string
): OrganogramNode | null => {
  if (node.id === id) {
    return node;
  }

  for (const child of node.children ?? []) {
    const found = findNode(child, id);

    if (found) {
      return found;
    }
  }

  return null;
};

// --------------------------------------------------
// MAIN ORGANOGRAM COMPONENT
// --------------------------------------------------

const Organogram: React.FC = () => {
  const [activeTier, setActiveTier] = useState<string>(
    ORG_TREE_STRUCT.id
  );

  const selectedNode = findNode(ORG_TREE_STRUCT, activeTier);

  return (
    <section className="w-full bg-[#FBF9F5] px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[#E8EFE9] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#143D2B]">
            Our Structure
          </span>

          <h2 className="mt-5 font-serif text-3xl font-bold text-[#143D2B] sm:text-4xl lg:text-5xl">
            Organisational Structure
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            A collaborative network of leadership, programme teams,
            advisors, fellows, and community partners working together
            towards menstrual dignity and equality.
          </p>
        </div>

        {/* Organogram hierarchy */}
        <div className="rounded-[2rem] border border-[#E5DFC5] bg-white p-4 shadow-sm sm:p-8 lg:p-10">
          <div className="mx-auto max-w-5xl">
            <OrganogramTreeNode
              node={ORG_TREE_STRUCT}
              activeTier={activeTier}
              onSelect={setActiveTier}
            />
          </div>
        </div>

        {/* Selected node details */}
        {selectedNode && (
          <div className="mx-auto mt-8 max-w-4xl">
            <div className="rounded-3xl border border-[#E5DFC5] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#C85A32]">
                    Selected Department
                  </span>

                  <h3 className="mt-2 font-serif text-2xl font-bold text-[#143D2B]">
                    {selectedNode.role}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {selectedNode.subtitle}
                  </p>
                </div>

                <span
                  className={`
                    inline-flex w-fit rounded-full px-4 py-2
                    text-xs font-bold uppercase tracking-wider
                    ${categoryStyles[selectedNode.category].badge}
                  `}
                >
                  {selectedNode.category}
                </span>
              </div>

              <div className="my-5 h-px bg-[#E5DFC5]" />

              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                {selectedNode.description}
              </p>

              {selectedNode.membersCount && (
                <p className="mt-4 text-sm font-semibold text-[#143D2B]">
                  Members: {selectedNode.membersCount}
                </p>
              )}

              {selectedNode.children?.length ? (
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Reporting Units
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedNode.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => setActiveTier(child.id)}
                        className="rounded-full border border-[#E5DFC5] bg-[#FBF9F5] px-4 py-2 text-xs font-semibold text-[#143D2B] transition hover:border-[#C85A32] hover:bg-[#F8EDE7]"
                      >
                        {child.role}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {(
            [
              ['board', 'Governance'],
              ['advisory', 'Advisory'],
              ['leadership', 'Leadership'],
              ['core', 'Core Teams'],
              ['regional', 'Regional Network'],
              ['grassroots', 'Grassroots Network'],
            ] as const
          ).map(([category, label]) => (
            <div key={category} className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${categoryStyles[category].dot}`}
              />
              <span className="text-xs font-medium text-slate-600">
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Organogram;