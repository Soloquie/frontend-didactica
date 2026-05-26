import React from 'react';
import { Camera } from 'lucide-react';
import { GroupMember } from '../types';

interface MemberCardProps {
  member: GroupMember;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80';

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <article className="min-w-[260px] sm:min-w-[300px] max-w-[320px] bg-white border border-natural-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 snap-start">
      <div className="aspect-[4/3] bg-natural-light-gray relative overflow-hidden">
        <img
          src={member.imagenUrl || DEFAULT_IMAGE}
          alt={member.nombre}
          className="w-full h-full object-cover transition duration-500 hover:scale-[1.03]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-natural-dark text-[10px] font-bold border border-white/50">
          <Camera className="w-3.5 h-3.5 text-sage" />
          Integrante
        </div>
      </div>
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-serif font-bold text-natural-dark tracking-tight">
          {member.nombre}
        </h3>
        <p className="text-sm text-natural-text leading-relaxed line-clamp-4">
          {member.descripcion}
        </p>
      </div>
    </article>
  );
}
