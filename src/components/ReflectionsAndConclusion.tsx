import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Heart, Sparkles, BookOpenCheck, Bookmark, Edit, Save, X } from 'lucide-react';

interface ReflectionsAndConclusionProps {
  isLoggedIn?: boolean;
}

interface ReflectionCardData {
  id: string;
  title: string;
  paragraphs: string[];
}

const INITIAL_REFLECTIONS: ReflectionCardData[] = [
  {
    id: 'praxis',
    title: 'La Dialéctica entre la Teoría Educativa y la Praxis de Aula',
    paragraphs: [
      'Durante años, la preparación universitaria ha sufrido un divorcio implícito entre "la teoría del libro" y "el frío realismo del aula de escuela". Esta materia, Didáctica, nos enseñó que ese abismo es ficticio. No es posible generar una actividad de aula lúdica (como el Bingo) o una estructura cooperativa (como el Jigsaw) de forma exitosa si no se comprende el porqué biológico o sociológico de esa acción.',
      'Sin Piaget, Vigotsky o Karl Kapp, el juego se reduce a mero entretenimiento ruidoso que no deja huella. Sin las leyes del andamiaje de Bruner, la torre de pitillos se cae cognitivamente. De tal modo, la auténtica didáctica representa un ciclo hermenéutico continuo: planificar con rigor teórico, simular y poner en común con valentía, equivocarse en la arena educativa, y volver a la teoría para reescribir con mayor compasión intelectual.'
    ]
  },
  {
    id: 'role',
    title: 'El Nuevo Rol del Educador',
    paragraphs: [
      '"El docente de este siglo no puede ser más un orador soberbio dedicado a declamar verdades estáticas. El maestro es el arquitecto del ambiente cognitivo de sus alumnos."',
      'Nuestra misión fundamental es diseñar los desafíos que hagan que el alumno desee movilizar sus recursos internos. Somos el apoyo temporal ("andamio") que se retira discretamente cuando el edificio de su autonomía comienza a valerse por sí mismo.'
    ]
  },
  {
    id: 'inclusion',
    title: 'La Didáctica como Ética de Inclusión Social',
    paragraphs: [
      'El Diseño Universal de Aprendizaje (DUA) no es un optativo burocrático de adorno técnico. Es un imperativo democrático y ético elemental.',
      'Cuando diseñamos actividades grupales de resolución (como en la Torre de Consenso) e imponemos límites ficticios, constatamos que la incapacidad de comunicarse no radica en la mente del estudiante marginado, sino en la tozudez del maestro que insiste en examinar de una única manera inflexible. La didáctica inclusiva sana la escuela.'
    ]
  },
  {
    id: 'critique',
    title: 'Nuestra Devolución Crítica: ¿Por qué valió la pena "Didáctica"?',
    paragraphs: [
      'Cerrar el semestre es, ante todo, un acto de sanación pedagógica colectiva. Haber manipulado telas para hacer títeres rústicos ecológicos nos bajó de la torre de marfil intelectual y nos conectó con la dimensión tierna del oficio. Haber debatido de forma estructurada en un rompecabezas cooperativo (Jigsaw) nos demostró que nuestros propios pares son fuentes primas de conocimiento, enriqueciendo nuestra confianza profesional.',
      'Salimos de esta aula no con más apuntes polvorientos para archivar, sino con una caja metodológica robusta repleta de herramientas operativas, listos para planificar con audacia, coevaluar con justicia y guiar con asertividad. Comprendemos que educar no es verter aguas muertas en un vaso vacío, sino encender un fuego sagrado de autodescubrimiento intelectual en cada alma que cruce nuestro umbral escolar.'
    ]
  }
];

export default function ReflectionsAndConclusion({ isLoggedIn = false }: ReflectionsAndConclusionProps) {
  const [reflections, setReflections] = useState<ReflectionCardData[]>(() => {
    const stored = localStorage.getItem('didactica_reflections');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading reflections', e);
      }
    }
    return INITIAL_REFLECTIONS;
  });

  useEffect(() => {
    localStorage.setItem('didactica_reflections', JSON.stringify(reflections));
  }, [reflections]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const startEditing = (card: ReflectionCardData) => {
    setEditingId(card.id);
    setEditTitle(card.title);
    setEditContent(card.paragraphs.join('\n\n'));
  };

  const handleSave = (id: string) => {
    const cleanedParagraphs = editContent
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    setReflections(prev => prev.map(ref => {
      if (ref.id === id) {
        return {
          ...ref,
          title: editTitle,
          paragraphs: cleanedParagraphs.length > 0 ? cleanedParagraphs : ref.paragraphs
        };
      }
      return ref;
    }));
    setEditingId(null);
  };

  const findRef = (id: string) => {
    return reflections.find(r => r.id === id) || INITIAL_REFLECTIONS.find(r => r.id === id)!;
  };

  return (
    <section className="py-16 bg-[#FDFBF7]" id="reflexiones-finales">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FCF8EE] text-[#A87B2E] border border-[#E5B558]/20">
            Sistematización de Cierre
          </span>
          <h2 className="text-3xl font-serif font-bold text-natural-dark sm:text-4xl">
            Reflexiones Críticas & Conclusión de Cátedra
          </h2>
          <p className="text-base text-natural-muted">
            El verdadero portafolio se consolida en la madurez interpretativa de quien enseña. Aquí examinamos de qué manera el curso de Didáctica redefinió nuestra ética pedagógica.
          </p>
        </div>

        {/* Bento Grid layout representing major analytical essays */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Metacognition essay */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-natural-border/80 flex flex-col justify-between space-y-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FCF8EE]/50 rounded-full blur-2xl -mr-12 -mt-12"></div>
            
            {editingId === 'praxis' ? (
              <div className="space-y-4 w-full relative z-10">
                <div className="flex justify-between items-center pb-2 border-b border-natural-border">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage font-mono">Editar Reflexión</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSave('praxis')} 
                      className="p-1.5 px-3.5 bg-sage hover:bg-[#4D5E43] text-white font-semibold text-xs rounded-xl transition cursor-pointer select-none active:scale-95"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="p-1.5 px-3.5 bg-natural-light-gray border border-natural-border hover:bg-natural-light-gray/85 text-natural-dark font-semibold text-xs rounded-xl transition cursor-pointer select-none active:scale-95"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-natural-tag font-mono block">Título de la Tarjeta</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white border border-natural-border rounded-xl p-2 px-3 text-sm focus:ring-1 focus:ring-sage font-serif font-bold text-natural-dark"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-natural-tag font-mono block">Contenido (Doble salto de línea separa párrafos)</label>
                  <textarea 
                    rows={6} 
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white border border-natural-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-sage font-sans text-natural-text resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-2.5 rounded-xl bg-gold-light text-[#A87B2E] border border-gold/20">
                      <BookOpenCheck className="w-5 h-5" />
                    </div>
                    {isLoggedIn && (
                      <button 
                        onClick={() => startEditing(findRef('praxis'))} 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sage hover:text-[#43523B] border border-sage/20 bg-sage-light/45 hover:bg-sage-light/85 p-1.5 px-3 rounded-lg transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Editar
                      </button>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-natural-dark">
                    {findRef('praxis').title}
                  </h3>
                  {findRef('praxis').paragraphs.map((p, idx) => (
                    <p key={idx} className="text-sm text-natural-text leading-relaxed font-sans">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="pt-6 border-t border-natural-border/70 flex flex-wrap gap-4 items-center justify-between text-xs text-natural-tag font-mono mt-auto">
                  <span>Ensayo final de cátedra</span>
                  <span>·</span>
                  <span>Conexión Teoría-Práctica</span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Teacher role callout */}
          <div className="lg:col-span-4 bg-sage rounded-3xl p-8 text-white flex flex-col justify-between space-y-6 relative overflow-hidden shadow-lg shadow-sage/5 hover:shadow-sage/10 transition-all">
            <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-[#4D5E43]/40 rounded-full blur-2xl"></div>
            
            {editingId === 'role' ? (
              <div className="space-y-4 w-full relative z-10 text-natural-dark bg-white/95 p-6 rounded-2xl border border-natural-border shadow">
                <div className="flex justify-between items-center pb-1.5 border-b border-natural-border">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-sage font-mono">Editar Rol</label>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => handleSave('role')} 
                      className="p-1 px-2.5 bg-sage text-white font-semibold text-[11px] rounded-lg cursor-pointer hover:bg-[#4D5E43] transition active:scale-95"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="p-1 px-2.5 bg-natural-light-gray text-natural-dark border border-natural-border font-semibold text-[11px] rounded-lg cursor-pointer hover:bg-natural-light-gray/80 transition active:scale-95"
                    >
                      X
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-natural-tag font-mono block">Título</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white border border-natural-border rounded-lg p-1.5 px-2.5 text-xs focus:ring-1 focus:ring-sage font-serif font-bold text-natural-dark"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-natural-tag font-mono block">Contenido (Doble salto separa párrafos)</label>
                  <textarea 
                    rows={5} 
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white border border-natural-border rounded-lg p-2 text-xs focus:ring-1 focus:ring-sage resize-none font-sans text-natural-text"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-2.5 rounded-xl bg-[#4D5E43] text-white shadow-inner">
                      <Sparkles className="w-5 h-5 text-[#E5B558]" />
                    </div>
                    {isLoggedIn && (
                      <button 
                        onClick={() => startEditing(findRef('role'))} 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5B558] hover:text-[#ffdb8f] border border-[#ffebbe]/20 bg-[#4D5E43]/45 hover:bg-[#4D5E43]/85 p-1.5 px-3 rounded-lg transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Editar
                      </button>
                    )}
                  </div>
                  <h3 className="text-xl font-serif font-bold">
                    {findRef('role').title}
                  </h3>
                  {findRef('role').paragraphs.map((p, idx) => (
                    <p key={idx} className="text-xs text-natural-bg/90 leading-relaxed font-sans">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#4D5E43]/55 relative z-10 flex items-center justify-between text-[11px] font-mono text-natural-bg/85 font-semibold mt-auto">
                  <span>El Desafío Docente</span>
                  <Award className="w-4 h-4 text-gold" />
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Inclusivity card */}
          <div className="lg:col-span-4 bg-natural-dark rounded-3xl p-8 text-white flex flex-col justify-between space-y-6 relative overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-[radial-gradient(#4A443F_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
            
            {editingId === 'inclusion' ? (
              <div className="space-y-4 w-full relative z-10 text-natural-dark bg-white/95 p-6 rounded-2xl border border-natural-border shadow">
                <div className="flex justify-between items-center pb-1.5 border-b border-natural-border">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-sage font-mono">Editar Inclusión</label>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => handleSave('inclusion')} 
                      className="p-1 px-2.5 bg-sage text-white font-semibold text-[11px] rounded-lg cursor-pointer hover:bg-[#4D5E43] transition active:scale-95"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="p-1 px-2.5 bg-natural-light-gray text-natural-dark border border-natural-border font-semibold text-[11px] rounded-lg cursor-pointer hover:bg-natural-light-gray/80 transition active:scale-95"
                    >
                      X
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-natural-tag font-mono block">Título</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white border border-natural-border rounded-lg p-1.5 px-2.5 text-xs focus:ring-1 focus:ring-sage font-serif font-bold text-natural-dark"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-natural-tag font-mono block">Contenido (Doble salto separa párrafos)</label>
                  <textarea 
                    rows={5} 
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white border border-natural-border rounded-lg p-2 text-xs focus:ring-1 focus:ring-sage resize-none font-sans text-natural-text"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-2.5 rounded-xl bg-[#4A443F] text-terracotta border border-[#6D655E]/20">
                      <Heart className="w-5 h-5" />
                    </div>
                    {isLoggedIn && (
                      <button 
                        onClick={() => startEditing(findRef('inclusion'))} 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:text-terracotta/90 border border-terracotta/20 bg-[#4A443F]/45 hover:bg-[#4A443F]/85 p-1.5 px-3 rounded-lg transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Editar
                      </button>
                    )}
                  </div>
                  <h3 className="text-xl font-serif font-bold">
                    {findRef('inclusion').title}
                  </h3>
                  {findRef('inclusion').paragraphs.map((p, idx) => (
                    <p key={idx} className="text-xs text-[#E8E2D9] leading-relaxed font-sans">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#4A443F]/60 relative z-10 flex items-center justify-between text-[11px] font-mono text-[#8C847C] mt-auto">
                  <span>Equidad Educativa</span>
                  <span>DUA</span>
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Deep overall synthesis */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-natural-border/85 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-sm">
            
            {editingId === 'critique' ? (
              <div className="space-y-4 w-full relative z-10">
                <div className="flex justify-between items-center pb-2 border-b border-natural-border">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage font-mono">Editar Conclusión</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSave('critique')} 
                      className="p-1.5 px-3.5 bg-sage hover:bg-[#4D5E43] text-white font-semibold text-xs rounded-xl transition cursor-pointer select-none active:scale-95"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="p-1.5 px-3.5 bg-natural-light-gray border border-natural-border hover:bg-natural-light-gray/85 text-natural-dark font-semibold text-xs rounded-xl transition cursor-pointer select-none active:scale-95"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-natural-tag font-mono block">Título de la Tarjeta</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white border border-natural-border rounded-xl p-2 px-3 text-sm focus:ring-1 focus:ring-sage font-serif font-bold text-natural-dark"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-natural-tag font-mono block">Contenido (Doble salto de línea separa párrafos)</label>
                  <textarea 
                    rows={6} 
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white border border-natural-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-sage font-sans text-natural-text resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex p-2.5 rounded-xl bg-natural-light-gray text-natural-dark border border-natural-border">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    {isLoggedIn && (
                      <button 
                        onClick={() => startEditing(findRef('critique'))} 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sage hover:text-[#43523B] border border-sage/20 bg-sage-light/45 hover:bg-sage-light/85 p-1.5 px-3 rounded-lg transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Editar
                      </button>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-natural-dark">
                    {findRef('critique').title}
                  </h3>
                  {findRef('critique').paragraphs.map((p, idx) => (
                    <p key={idx} className="text-sm text-natural-text leading-relaxed font-sans">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="pt-6 border-t border-natural-border/70 flex items-center justify-between text-xs text-natural-tag font-mono mt-auto">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sage" />
                    <span>Docencia Sistémica Autorizada</span>
                  </div>
                  <span>Portafolio de Cierre</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Global Signature of the team */}
        <div className="mt-16 text-center border-t border-natural-border pt-8 max-w-sm mx-auto">
          <p className="text-sm font-bold text-natural-dark font-serif mt-1">Actividades realizadas por: Leonardo, Oveimar, Maria y Veronica</p>
          <p className="text-[10px] text-natural-muted font-sans mt-0.5">Licenciatura en Matemáticas.</p>
        </div>

      </div>
    </section>
  );
}
