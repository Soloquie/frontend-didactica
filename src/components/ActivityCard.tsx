import React from 'react';
import { Activity } from '../types';
import { Clock, BookOpen, Compass, ArrowRight, Award } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onOpenDetails: (activity: Activity) => void;
  key?: string | number;
}

export default function ActivityCard({ activity, onOpenDetails }: ActivityCardProps) {
  // Determine badge color based on category
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'juegos':
        return 'bg-gold-light text-[#A87B2E] border-gold/20';
      case 'dinamicas':
        return 'bg-soft-blue-light text-[#4A728E] border-soft-blue/20';
      case 'aula':
        return 'bg-sage-light text-sage border-sage/20';
      case 'proyectos':
        return 'bg-terracotta-light text-terracotta border-terracotta/20';
      case 'evidencias':
        return 'bg-soft-blue-light text-[#4A728E] border-soft-blue/20';
      case 'reflexiones':
        return 'bg-sage-light text-sage border-sage/20';
      default:
        return 'bg-natural-light-gray text-natural-text border-natural-border';
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Fácil':
        return 'text-sage bg-sage-light';
      case 'Medio':
        return 'text-[#B08A35] bg-[#FCF8EE]';
      case 'Avanzado':
        return 'text-terracotta bg-terracotta-light';
      default:
        return 'text-natural-muted bg-natural-light-gray';
    }
  };

  return (
    <div 
      className="bg-white rounded-3xl border border-natural-border hover:border-sage hover:shadow-xl hover:shadow-sage/5 transition-all duration-300 flex flex-col h-full overflow-hidden group"
      id={`card-${activity.id}`}
    >
      {/* Card Image Cover containing a gorgeous overlay badge */}
      <div className="relative aspect-[4/3] overflow-hidden bg-natural-light-gray">
        <img 
          src={activity.evidenceImages[0] || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80'} 
          alt={activity.title}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.04]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-natural-dark/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
        
        {/* Category Floating Badge */}
        <span className={`absolute top-4 left-4 inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border shadow-sm ${getCategoryColor(activity.category)}`}>
          {activity.categoryLabel}
        </span>

        {/* Floating Tag */}
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/90 backdrop-blur-sm text-natural-dark shadow-sm font-sans">
          <Compass className="w-3.5 h-3.5 text-sage" /> {activity.tag}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-serif font-bold text-natural-dark tracking-tight leading-snug group-hover:text-sage transition-colors">
            {activity.title}
          </h3>
          <p className="text-sm text-natural-text font-sans line-clamp-3">
            {activity.description}
          </p>
        </div>

        {/* Quick Didactic specs */}
        <div className="grid grid-cols-2 gap-2 text-xs border-y border-natural-border py-3 font-mono text-natural-tag">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-natural-tag/80" />
            <span>Prepa: {activity.preparationTime}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Award className="w-3.5 h-3.5 text-natural-tag/80" />
            <span className={`px-1.5 py-0.5 rounded-md ${getDifficultyColor(activity.difficulty)}`}>
              Dificultad: {activity.difficulty}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-natural-text">
          <p className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Paradigma central</p>
          <p className="text-xs font-semibold text-natural-dark font-sans truncate">{activity.pedagogicalParadigm}</p>
        </div>

        {/* Action button */}
        <button 
          onClick={() => onOpenDetails(activity)}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#F9F6F2] hover:bg-sage-light text-natural-text hover:text-sage font-semibold py-2.5 px-4 rounded-xl border border-natural-border hover:border-sage/40 transition-all cursor-pointer text-sm"
          id={`btn-view-${activity.id}`}
        >
          <span>Examinar Análisis Pedagógico</span>
          <ArrowRight className="w-4 h-4 transition duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
