import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, HelpCircle, Compass, BrainCircuit, Edit3, Eye, EyeOff, Save, X } from 'lucide-react';

interface IntroCardData {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  keyPrinciples: string[];
  order: number;
  active: boolean;
  iconName: 'brain' | 'book' | 'compass';
}

interface IntroductionProps {
  isLoggedIn?: boolean;
}

const STORAGE_KEY = 'didactica_intro_cards';

const INITIAL_TABS: IntroCardData[] = [
  {
    id: 'didactica',
    title: '¿Qué es la Didáctica?',
    subtitle: 'Ciencia del Aprendizaje',
    iconName: 'brain',
    order: 1,
    active: true,
    content: 'La didáctica es la rama de la pedagogía que se encarga de estudiar y diseñar los procesos o métodos de enseñanza y aprendizaje. Su propósito sustancial no es solo transmitir información, sino estructurar escenarios óptimos, andamiajes pertinentes e interacciones significativas para que cada estudiante logre construir un conocimiento perdurable y funcional.',
    keyPrinciples: [
      'Organización del entorno escolar',
      'Mediación activa docente-alumno',
      'Transposición didáctica',
      'Diseño de instrumentos prácticos',
    ],
  },
  {
    id: 'portafolio',
    title: '¿Por qué un Portafolio?',
    subtitle: 'Evidencia de Transformación',
    iconName: 'book',
    order: 2,
    active: true,
    content: 'Este portafolio académico no es simplemente un repositorio estático de tareas universitarias. Es una herramienta metacognitiva viva diseñada para documentar la toma de decisiones metodológicas. Permite examinar el proceso de planificación, la experimentación real con dinámicas, la autoevaluación sincera y el crecimiento conceptual de cara a la profesión docente.',
    keyPrinciples: [
      'Registro de aciertos y adaptaciones',
      'Evidencia fotográfica comentada',
      'Análisis crítico sistemático',
      'Vínculo explícito Teoría-Práctica',
    ],
  },
  {
    id: 'paradigma',
    title: 'Nuestro Enfoque Activo',
    subtitle: 'Compromiso Pedagógico',
    iconName: 'compass',
    order: 3,
    active: true,
    content: 'Nuestra propuesta se fundamenta en la Didáctica Activa y el Socioconstructivismo. Creemos firmemente que el aprendizaje ocurre haciendo, jugando, debatiendo y cooperando de forma intencionada. Reemplazamos al estudiante pasivo por un creador activo de materiales didácticos, solucionador de problemas cotidianos y líder de su propia cognición.',
    keyPrinciples: [
      'Estudiante como protagonista',
      'Zona de Desarrollo Próximo',
      'Gamificación con propósito',
      'Evaluación para el aprendizaje',
    ],
  },
];

function getIcon(iconName: IntroCardData['iconName']) {
  if (iconName === 'book') return <BookOpen className="w-5 h-5 text-terracotta" />;
  if (iconName === 'compass') return <Compass className="w-5 h-5 text-gold" />;
  return <BrainCircuit className="w-5 h-5 text-sage" />;
}

function loadCards(): IntroCardData[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_TABS;
  try {
    const parsed = JSON.parse(stored) as IntroCardData[];
    return parsed.length ? parsed : INITIAL_TABS;
  } catch {
    return INITIAL_TABS;
  }
}

export default function Introduction({ isLoggedIn = false }: IntroductionProps) {
  const [cards, setCards] = useState<IntroCardData[]>(loadCards);
  const [activeTab, setActiveTab] = useState<string>('didactica');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<IntroCardData | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const visibleCards = useMemo(() => {
    return cards
      .filter(card => isLoggedIn || card.active)
      .sort((a, b) => a.order - b.order);
  }, [cards, isLoggedIn]);

  useEffect(() => {
    if (!visibleCards.some(card => card.id === activeTab)) {
      setActiveTab(visibleCards[0]?.id || '');
    }
  }, [activeTab, visibleCards]);

  const selectedCard = visibleCards.find(card => card.id === activeTab) || visibleCards[0];

  const startEditing = (card: IntroCardData) => {
    setEditingId(card.id);
    setDraft({ ...card, keyPrinciples: [...card.keyPrinciples] });
  };

  const saveDraft = () => {
    if (!draft) return;
    const cleaned: IntroCardData = {
      ...draft,
      title: draft.title.trim() || 'Tarjeta sin título',
      subtitle: draft.subtitle.trim(),
      content: draft.content.trim(),
      order: Number.isFinite(Number(draft.order)) ? Number(draft.order) : 0,
      keyPrinciples: draft.keyPrinciples.map(item => item.trim()).filter(Boolean),
    };
    setCards(prev => prev.map(card => card.id === cleaned.id ? cleaned : card));
    setEditingId(null);
    setDraft(null);
    setActiveTab(cleaned.id);
  };

  return (
    <section className="py-16 bg-[#FDFBF7]" id="introduccion">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl font-serif font-bold text-natural-dark tracking-tight sm:text-4xl">
            Sistematización de la Experiencia Didáctica
          </h2>
          <p className="text-base text-natural-muted">
            Aprender didáctica implica encarnar sus premisas. Este portafolio digital organiza los artefactos producidos, detallando su estructura, resultados prácticos y fundamentos pedagógicos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
            {visibleCards.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition duration-300 focus:outline-none ${
                  activeTab === tab.id
                    ? 'bg-white border-[#5E7153]/50 shadow-md shadow-[#5E7153]/5'
                    : 'bg-[#F9F6F2]/60 hover:bg-[#F9F6F2] border-[#E8E2D9] hover:border-[#D6CFC7]'
                } ${!tab.active ? 'opacity-65' : ''}`}
                id={`tab-intro-${tab.id}`}
              >
                <div className={`p-3 rounded-xl ${
                  activeTab === tab.id ? 'bg-sage-light text-sage' : 'bg-[#E8E2D9]/40 text-natural-tag'
                }`}>
                  {getIcon(tab.iconName)}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-natural-tag font-mono tracking-wider">{tab.subtitle}</p>
                  <p className="text-lg font-bold text-natural-dark font-serif mt-0.5">{tab.title}</p>
                  {isLoggedIn && !tab.active && (
                    <span className="inline-flex mt-2 text-[10px] font-bold text-terracotta bg-terracotta-light border border-terracotta/20 px-2 py-0.5 rounded-full">
                      Oculta
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 flex">
            <div className="w-full bg-white border border-[#E8E2D9] rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-sage-light rounded-full blur-2xl -mr-16 -mt-16" />

              {selectedCard && editingId === selectedCard.id && draft ? (
                <div className="space-y-5 relative z-10 animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-natural-border pb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-sage font-mono">Editar tarjeta</p>
                    <div className="flex gap-2">
                      <button onClick={saveDraft} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sage text-white text-xs font-bold hover:bg-[#4D5E43]">
                        <Save className="w-3.5 h-3.5" /> Guardar
                      </button>
                      <button onClick={() => { setEditingId(null); setDraft(null); }} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-natural-light-gray border border-natural-border text-natural-dark text-xs font-bold">
                        <X className="w-3.5 h-3.5" /> Cancelar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="space-y-1.5">
                      <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Título</span>
                      <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full bg-white border border-natural-border rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-sage" />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Subtítulo</span>
                      <input value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} className="w-full bg-white border border-natural-border rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-sage" />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Orden</span>
                      <input type="number" value={draft.order} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} className="w-full bg-white border border-natural-border rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-sage" />
                    </label>
                    <label className="flex items-center gap-3 pt-6">
                      <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} className="w-4 h-4 accent-sage" />
                      <span className="text-xs font-bold text-natural-dark">Mostrar tarjeta</span>
                    </label>
                  </div>

                  <label className="space-y-1.5 block">
                    <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Contenido</span>
                    <textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} rows={5} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-sage resize-none" />
                  </label>

                  <label className="space-y-1.5 block">
                    <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Principios, uno por línea</span>
                    <textarea value={draft.keyPrinciples.join('\n')} onChange={(e) => setDraft({ ...draft, keyPrinciples: e.target.value.split('\n') })} rows={4} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-sage resize-none" />
                  </label>
                </div>
              ) : selectedCard ? (
                <div className="space-y-6 animate-fade-in relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sage font-mono">
                      <HelpCircle className="w-5 h-5" />
                      <span className="text-xs font-semibold uppercase tracking-widest">Fundamentos de la Cátedra</span>
                    </div>
                    {isLoggedIn && (
                      <button onClick={() => startEditing(selectedCard)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-light text-sage border border-sage/20 text-xs font-bold hover:bg-sage-light/80">
                        <Edit3 className="w-3.5 h-3.5" /> Editar
                      </button>
                    )}
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-natural-dark">
                    {selectedCard.title}
                  </h3>

                  <p className="text-natural-text leading-relaxed font-sans text-base">
                    {selectedCard.content}
                  </p>

                  <div>
                    <p className="text-sm font-semibold text-natural-dark font-serif mb-3">Principios claves que guiaron nuestra labor:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCard.keyPrinciples.map((principle, index) => (
                        <li key={index} className="flex items-center gap-2.5 text-sm text-natural-muted font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              <div className="pt-6 border-t border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-mono text-natural-tag">
                <span>Didactica - Universidad del Quindio</span>
                <span>Enfoque Constructivista Crítico</span>
              </div>

              {isLoggedIn && (
                <div className="flex items-center gap-2 text-[10px] text-natural-tag font-mono">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visible</span>
                  <EyeOff className="w-3.5 h-3.5 ml-2" />
                  <span>Oculta</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
