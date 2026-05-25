import React, { useState } from 'react';
import { BookOpen, HelpCircle, Compass, BrainCircuit } from 'lucide-react';

interface TabContent {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: string;
  keyPrinciples: string[];
}

export default function Introduction() {
  const [activeTab, setActiveTab] = useState<string>('didactica');

  const tabs: TabContent[] = [
    {
      id: 'didactica',
      title: '¿Qué es la Didáctica?',
      subtitle: 'Ciencia del Aprendizaje',
      icon: <BrainCircuit className="w-5 h-5 text-sage" />,
      content: 'La didáctica es la rama de la pedagogía que se encarga de estudiar y diseñar los procesos o métodos de enseñanza y aprendizaje. Su propósito sustancial no es solo transmitir información, sino estructurar escenarios óptimos, andamiajes pertinentes e interacciones significativas para que cada estudiante logre construir un conocimiento perdurable y funcional.',
      keyPrinciples: [
        'Organización del entorno escolar',
        'Mediación activa docente-alumno',
        'Transposición didáctica (simplificar la complejidad)',
        'Diseño de instrumentos prácticos'
      ]
    },
    {
      id: 'portafolio',
      title: '¿Por qué un Portafolio?',
      subtitle: 'Evidencia de Transformación',
      icon: <BookOpen className="w-5 h-5 text-terracotta" />,
      content: 'Este portafolio académico no es simplemente un repositorio estático de tareas universitarias. Es una herramienta metacognitiva viva diseñada para documentar la toma de decisiones metodológicas. Permite examinar el proceso de planificación, la experimentación real con dinámicas, la autoevaluación sincera y el crecimiento conceptual de cara a la profesión docente.',
      keyPrinciples: [
        'Registro de aciertos y adaptaciones',
        'Evidencia fotográfica comentada',
        'Análisis crítico sistemático',
        'Vínculo explícito Teoría-Práctica'
      ]
    },
    {
      id: 'paradigma',
      title: 'Nuestro Enfoque Activo',
      subtitle: 'Compromiso Pedagógico',
      icon: <Compass className="w-5 h-5 text-gold" />,
      content: 'Nuestra propuesta se fundamente en la Didáctica Activa y el Socioconstructivismo. Creemos firmemente que el aprendizaje ocurre "haciendo", jugando, debatiendo y cooperando de forma intencionada. Reemplazamos al estudiante pasivo del conductismo por un creador activo de materiales didácticos, solucionador de problemas cotidianos y líder de su propia cognición.',
      keyPrinciples: [
        'Estudiante como protagonista (Piaget)',
        'Zona de Desarrollo Próximo (Vygotsky)',
        'Gamificación con causa (Karl Kapp)',
        'Evaluación para el aprendizaje (Wiggins)'
      ]
    }
  ];

  return (
    <section className="py-16 bg-[#FDFBF7]" id="introduccion">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl font-serif font-bold text-natural-dark tracking-tight sm:text-4xl">
            Sistematización de la Experiencia Didáctica
          </h2>
          <p className="text-base text-natural-muted">
            Aprender didáctica implica encarnar sus premisas. Este portafolio digital organiza los artefactos producidos, detallando su estructura técnica, resultados prácticos y fundamentos pedagógicos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Navigation vertical buttons */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition duration-300 focus:outline-none ${
                  activeTab === tab.id
                    ? 'bg-white border-[#5E7153]/50 shadow-md shadow-[#5E7153]/5'
                    : 'bg-[#F9F6F2]/60 hover:bg-[#F9F6F2] border-[#E8E2D9] hover:border-[#D6CFC7]'
                }`}
                id={`tab-intro-${tab.id}`}
              >
                <div className={`p-3 rounded-xl ${
                  activeTab === tab.id ? 'bg-sage-light text-sage' : 'bg-[#E8E2D9]/40 text-natural-tag'
                }`}>
                  {tab.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-natural-tag font-mono tracking-wider">{tab.subtitle}</p>
                  <p className="text-lg font-bold text-natural-dark font-serif mt-0.5">{tab.title}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          <div className="lg:col-span-8 flex">
            <div className="w-full bg-white border border-[#E8E2D9] rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-sage-light rounded-full blur-2xl -mr-16 -mt-16"></div>
              
              {tabs.map((tab) => {
                if (tab.id !== activeTab) return null;
                return (
                  <div key={tab.id} className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 text-sage font-mono">
                      <HelpCircle className="w-5 h-5" />
                      <span className="text-xs font-semibold uppercase tracking-widest">Fundamentos de la Cátedra</span>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-natural-dark">
                      {tab.title}
                    </h3>
                    
                    <p className="text-natural-text leading-relaxed font-sans text-base">
                      {tab.content}
                    </p>

                    <div>
                      <p className="text-sm font-semibold text-natural-dark font-serif mb-3">Principios claves que guiaron nuestra labor:</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tab.keyPrinciples.map((principle, index) => (
                          <li key={index} className="flex items-center gap-2.5 text-sm text-natural-muted font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                            <span>{principle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}

              <div className="pt-6 border-t border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-mono text-natural-tag">
                <span>Cátedra de Didáctica I · Universidad Nacional</span>
                <span>Enfoque Constructivista Crítico</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
