import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GroupMember } from '../types';
import MemberCard from './MemberCard';

interface MembersCarouselProps {
  members: GroupMember[];
}

export default function MembersCarousel({ members }: MembersCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollBy({
      left: direction === 'right' ? 340 : -340,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-end gap-2 mb-4">
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-xl bg-white border border-natural-border text-natural-dark hover:bg-sage-light hover:text-sage transition"
          aria-label="Ver integrantes anteriores"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="p-2 rounded-xl bg-white border border-natural-border text-natural-dark hover:bg-sage-light hover:text-sage transition"
          aria-label="Ver más integrantes"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3"
      >
        {members.map((member, index) => (
          <MemberCard key={`${member.nombre}-${index}`} member={member} />
        ))}
      </div>
    </div>
  );
}
