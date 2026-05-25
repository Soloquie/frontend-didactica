import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, Compass, BookOpen } from 'lucide-react';
import { Activity } from '../types';

interface HeaderProps {
  activities?: Activity[];
}

export default function Header({ activities = [] }: HeaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activities.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activities.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [activities.length]);

  const activeActivity = activities[currentIndex] || null;

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#FDFBF7] via-[#F9F6F2] to-[#F1EDE4] border-b border-[#E8E2D9] py-16 sm:py-24" id="portfolio-hero">
      <div className="absolute inset-0 bg-[radial-gradient(#5E7153_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-sage-light text-sage border border-sage/20 font-serif transition duration-300 hover:bg-sage-light/85">
              <GraduationCap className="w-4 h-4 text-sage" /> Portafolio Académico Digital
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-natural-dark leading-tight tracking-tight">
              Didáctica <br className="hidden sm:inline" />
              <span className="text-sage">
                El Arte y Ciencia
              </span> de Enseñar
            </h1>
            
            <p className="text-lg text-natural-muted max-w-2xl leading-relaxed font-sans mx-auto lg:mx-0">
              Bienvenido a la sistematización interactiva de actividades, juegos pedagógicos y reflexiones críticas construidos a lo largo del curso. Una demostración práctica de cómo el socioconstructivismo, la gamificación y el diseño inclusivo se convierten en acción viva dentro de las aulas.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <a 
                href="#actividades"
                className="inline-flex items-center gap-2 bg-sage hover:bg-sage-hover active:bg-sage text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-sage/15 transition-all hover:shadow-sage/25 active:scale-[0.98] cursor-pointer"
                id="btn-explore-activities"
              >
                <BookOpen className="w-5 h-5" /> Explorar Actividades
              </a>
            </div>

            {/* Quick stats tags */}
            <div className="flex flex-wrap gap-6 items-center justify-center lg:justify-start pt-6 text-xs text-natural-tag font-mono">
              <div className="flex items-center gap-2 bg-white/70 py-1.5 px-3 rounded-lg border border-natural-border/60">
                <span className="w-2.5 h-2.5 rounded-full bg-sage animate-pulse"></span>
                <span>Curso: Didáctica</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 py-1.5 px-3 rounded-lg border border-natural-border/60">
                <Award className="w-4.5 h-4.5 text-terracotta" />
                <span>Gestión Metodológica</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 py-1.5 px-3 rounded-lg border border-natural-border/60">
                <span>Año: 2026</span>
              </div>
            </div>
          </div>
          
          {/* Banner Graphic Frame */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="absolute -inset-2 bg-gradient-to-tr from-sage to-terracotta rounded-3xl opacity-15 blur-xl"></div>
            <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-natural-border/60 max-w-md mx-auto overflow-hidden min-h-[360px] flex flex-col justify-between">
              {activeActivity ? (
                <div key={activeActivity.id} className="animate-fade-in space-y-4 flex flex-col justify-between h-full">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-natural-light-gray flex items-center justify-center relative">
                    <img 
                      src={activeActivity.evidenceImages && activeActivity.evidenceImages[0] ? activeActivity.evidenceImages[0] : "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80"} 
                      alt={activeActivity.title} 
                      className="w-full h-full object-cover transition duration-500 hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-3 left-3 bg-sage px-2.5 py-1 text-[9px] font-mono tracking-wider text-white uppercase rounded-md font-bold shadow-sm">
                      {activeActivity.categoryLabel}
                    </span>
                  </div>
                  <div className="pt-2 px-2 space-y-1">
                    <p className="text-xs font-semibold text-sage uppercase tracking-widest font-mono">Artefacto Destacado</p>
                    <p className="text-base font-bold text-natural-dark font-serif truncate" title={activeActivity.title}>
                      {activeActivity.title}
                    </p>
                    <p className="text-xs text-natural-muted line-clamp-2">
                      {activeActivity.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-natural-light-gray/60 border border-dashed border-natural-border flex flex-col items-center justify-center text-center p-6 space-y-2 h-full">
                  <BookOpen className="w-8 h-8 text-natural-tag" />
                  <p className="text-xs font-bold text-natural-dark font-serif">Aún no hay artefactos disponibles</p>
                  <p className="text-[10px] text-natural-muted leading-relaxed">No se encontraron actividades registradas en el portafolio.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
