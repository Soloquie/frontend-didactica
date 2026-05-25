import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { X, Target, ClipboardList, Lightbulb, Heart, Compass, Clock, Award } from 'lucide-react';

interface ActivityDetailModalProps {
  activity: Activity | null;
  onClose: () => void;
}

export default function ActivityDetailModal({ activity, onClose }: ActivityDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [checkedMaterials, setCheckedMaterials] = useState<Record<string, boolean>>({});

  // Reset image index when activity changes
  useEffect(() => {
    setActiveImageIndex(0);
    setCheckedMaterials({});
  }, [activity]);

  if (!activity) return null;

  const handleToggleMaterial = (material: string) => {
    setCheckedMaterials(prev => ({
      ...prev,
      [material]: !prev[material]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-natural-dark/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full h-[90vh] md:h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-natural-border z-10 animate-scale-in"
        id="detail-modal-container"
      >
        {/* Top Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-natural-border sticky top-0 bg-white z-20">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-sage-light text-sage border border-sage/20 font-serif">
              Análisis Didáctico Detallado
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-natural-tag hover:text-[#2D2926] hover:bg-natural-light-gray transition cursor-pointer"
            aria-label="Cerrar modal"
            id="btn-close-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#FDFBF7]">
          {/* Main Title Section */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-natural-light-gray text-natural-text border border-natural-border">
                Categoría: {activity.categoryLabel}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-sage-light text-sage border border-sage/20 font-semibold">
                Paradigma: {activity.pedagogicalParadigm}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-natural-dark tracking-tight">
              {activity.title}
            </h2>
          </div>

          {/* Interactive Evidence Gallery & Quick Specs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Gallery Panel */}
            <div className="md:col-span-7 space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-natural-light-gray border border-natural-border relative group">
                <img 
                  src={activity.evidenceImages[activeImageIndex] || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80'} 
                  alt={`Evidencia ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Image Label indicator */}
                <div className="absolute bottom-3 right-3 bg-natural-dark/75 text-white text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded-md backdrop-blur-sm">
                  Galería: {activeImageIndex + 1} / {activity.evidenceImages.length}
                </div>
              </div>

              {/* Thumbnails list */}
              {activity.evidenceImages.length > 1 && (
                <div className="flex gap-2">
                  {activity.evidenceImages.map((img, ix) => (
                    <button
                      key={ix}
                      onClick={() => setActiveImageIndex(ix)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                        activeImageIndex === ix ? 'border-sage scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Miniatura" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs Panel */}
            <div className="md:col-span-5 bg-white border border-natural-border rounded-2xl p-5 space-y-5 shadow-sm">
              <h4 className="text-xs font-bold text-natural-tag uppercase tracking-widest font-mono">Ficha Técnica</h4>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Target className="w-4.5 h-4.5 text-sage mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-natural-dark font-serif">Público Dirigido</p>
                    <p className="text-natural-text font-sans text-xs">{activity.targetGroup || 'Focalización abierta'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4.5 h-4.5 text-terracotta mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-natural-dark font-serif">Tiempo de Elaboración</p>
                    <p className="text-natural-text font-sans text-xs">{activity.preparationTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-4.5 h-4.5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-natural-dark font-serif">Nivel de Complejidad</p>
                    <p className="text-natural-text font-sans text-xs">{activity.difficulty}</p>
                  </div>
                </div>
              </div>

              {/* Materials Checklist (Interactive checkbox) */}
              {activity.materials && activity.materials.length > 0 && (
                <div className="pt-4 border-t border-natural-border space-y-3">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-sage" />
                    <span className="text-xs font-bold text-natural-dark font-serif">Materiales (Interactivos)</span>
                  </div>
                  <p className="text-[10px] text-natural-tag font-sans italic">Marca los materiales para simular la preparación de tu caja didáctica:</p>
                  
                  <div className="space-y-1.5 pt-1">
                    {activity.materials.map((mat, i) => (
                      <label 
                        key={i}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#F9F6F2] hover:bg-[#F3F0EC] border border-natural-border/60 transition cursor-pointer select-none text-xs"
                      >
                        <input 
                          type="checkbox" 
                          checked={!!checkedMaterials[mat]} 
                          onChange={() => handleToggleMaterial(mat)}
                          className="rounded text-sage focus:ring-sage h-3.5 w-3.5 border-natural-border"
                        />
                        <span className={`text-natural-text font-sans ${checkedMaterials[mat] ? 'line-through text-natural-tag italic' : ''}`}>
                          {mat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Core Content: Description & Objectives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-natural-border">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-natural-dark font-serif flex items-center gap-2">
                <span className="w-1.5 h-4 rounded bg-sage"></span> 
                ¿En qué consistió?
              </h3>
              <p className="text-sm text-natural-text leading-relaxed font-sans">
                {activity.description}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-natural-dark font-serif flex items-center gap-2">
                <span className="w-1.5 h-4 rounded bg-terracotta"></span> 
                Objetivo Pedagógico / Didáctico
              </h3>
              <p className="text-sm text-natural-text leading-relaxed font-sans">
                {activity.objective}
              </p>
            </div>
          </div>

          {/* Key learnings Checklist */}
          <div className="bg-sage-light border border-sage/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-sage font-serif flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-sage animate-pulse" /> Aprendizajes Obtenidos
            </h3>
            <ul className="space-y-3">
              {activity.learnings.map((learning, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center bg-sage text-white text-xs font-bold rounded-full w-5 h-5 shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-natural-dark font-sans font-medium">{learning}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Reflection */}
          <div className="bg-terracotta-light border border-terracotta/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-terracotta font-serif flex items-center gap-2">
              <Heart className="w-5 h-5 text-terracotta" /> Reflexión Pedagógica Crítica
            </h3>
            <p className="text-sm text-natural-text leading-relaxed font-sans italic">
              "{activity.reflection}"
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-natural-tag">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
              <span>Análisis de Formación Docente</span>
              <span>·</span>
              <span>Sistematización Metacognitiva</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-natural-border bg-[#F9F6F2] flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-white border border-natural-border hover:border-natural-tag text-natural-dark hover:bg-natural-light-gray transition cursor-pointer"
          >
            Entendido, Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
