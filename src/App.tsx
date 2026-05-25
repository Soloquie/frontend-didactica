import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Introduction from './components/Introduction';
import ActivityCard from './components/ActivityCard';
import ActivityDetailModal from './components/ActivityDetailModal';
import ReflectionsAndConclusion from './components/ReflectionsAndConclusion';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import { ACTIVITIES, DIDACTIC_METRICS } from './data/activities';
import { Activity, ActivityCategory, ActivityFormData, ActivityStatus, AuthUser, Category, LearningItem, MaterialItem } from './types';
import { Search, Filter, GraduationCap, X, Sparkles, Clock, Layers, Users, RefreshCw, AlertCircle } from 'lucide-react';
import { clearAuth, didacticaApi, getStoredUser } from './services/api';

const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, nombre: 'Juegos didácticos', slug: 'juegos-didacticos', uiCategory: 'juegos', orden: 1 },
  { id: 2, nombre: 'Dinámicas grupales', slug: 'dinamicas-grupales', uiCategory: 'dinamicas', orden: 2 },
  { id: 3, nombre: 'Actividades de aula', slug: 'actividades-de-aula', uiCategory: 'aula', orden: 3 },
  { id: 4, nombre: 'Proyectos creativos', slug: 'proyectos-creativos', uiCategory: 'proyectos', orden: 4 },
  { id: 5, nombre: 'Reflexiones', slug: 'reflexiones', uiCategory: 'reflexiones', orden: 5 },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser());

  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);
  const [adminActivities, setAdminActivities] = useState<Activity[]>([]);
  const [loadingPublic, setLoadingPublic] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  const isLoggedIn = Boolean(currentUser?.token);

  useEffect(() => {
    loadPublicData();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setShowAdminPanel(true);
      loadAdminData();
    } else {
      setShowAdminPanel(false);
      setAdminActivities([]);
    }
  }, [isLoggedIn]);

  const loadPublicData = async () => {
    setLoadingPublic(true);
    setApiStatus(null);
    try {
      const [backendCategories, backendActivities] = await Promise.all([
        didacticaApi.getPublicCategorias(),
        didacticaApi.getPublicActividades(),
      ]);
      if (backendCategories.length) setCategories(backendCategories);
      setActivities(backendActivities.length ? backendActivities : ACTIVITIES);
    } catch (err) {
      setActivities(ACTIVITIES);
      setApiStatus('No se pudo conectar con el backend. Se muestra una vista de demostración mientras el servidor está apagado o sin datos iniciales.');
      console.warn('Public API unavailable:', err);
    } finally {
      setLoadingPublic(false);
    }
  };

  const loadAdminData = async () => {
    if (!isLoggedIn) return;
    setLoadingAdmin(true);
    try {
      const [backendCategories, backendActivities] = await Promise.all([
        didacticaApi.getPublicCategorias().catch(() => categories),
        didacticaApi.getAdminActividades(),
      ]);
      if (backendCategories.length) setCategories(backendCategories);
      setAdminActivities(backendActivities);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No fue posible cargar el panel administrativo.';
      setApiStatus(message);
      if (message.toLowerCase().includes('401') || message.toLowerCase().includes('403')) {
        handleLogout();
      }
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleLogin = async (correo: string, password: string) => {
    const user = await didacticaApi.login(correo, password);
    setCurrentUser(user);
    setApiStatus(null);
    return user;
  };

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
    setShowAdminPanel(false);
  };

  const syncChildren = async (activityId: number, form: ActivityFormData, original?: Activity | null) => {
    const originalLearnings = original?.learningItems || [];
    const originalMaterials = original?.materialItems || [];
    const originalEvidences = original?.evidenceItems || [];

    const learningOps = form.learnings.map((learning, idx) => {
      const payload: LearningItem = { ...learning, orden: idx };
      if (payload.id) return didacticaApi.updateAprendizaje(payload);
      return didacticaApi.createAprendizaje(activityId, payload);
    });
    const removedLearnings = originalLearnings
      .filter(old => old.id && !form.learnings.some(current => current.id === old.id))
      .map(old => didacticaApi.deleteAprendizaje(old.id!));

    const materialOps = form.materials.map(material => {
      const payload: MaterialItem = { ...material };
      if (payload.id) return didacticaApi.updateMaterial(payload);
      return didacticaApi.createMaterial(activityId, payload);
    });
    const removedMaterials = originalMaterials
      .filter(old => old.id && !form.materials.some(current => current.id === old.id))
      .map(old => didacticaApi.deleteMaterial(old.id!));

    const removedEvidences = originalEvidences
      .filter(old => old.id && !form.evidenceItems.some(current => current.id === old.id))
      .map(old => didacticaApi.deleteEvidencia(old.id!));

    const newUrlEvidences = form.newEvidenceUrls.map((url, idx) =>
      didacticaApi.createEvidenceFromUrl(activityId, url, form.evidenceItems.length + idx, form.evidenceItems.length === 0 && idx === 0)
    );
    const newFileEvidences = form.newEvidenceFiles.map((file, idx) =>
      didacticaApi.uploadEvidenceFile(activityId, file, form.evidenceItems.length + form.newEvidenceUrls.length + idx, form.evidenceItems.length === 0 && form.newEvidenceUrls.length === 0 && idx === 0)
    );

    await Promise.all([
      ...learningOps,
      ...removedLearnings,
      ...materialOps,
      ...removedMaterials,
      ...removedEvidences,
      ...newUrlEvidences,
      ...newFileEvidences,
    ]);
  };

  const handleSaveActivity = async (form: ActivityFormData, originalActivity?: Activity | null) => {
    let saved: Activity;
    if (form.backendId) {
      saved = await didacticaApi.updateActividad(form.backendId, form, categories);
    } else {
      saved = await didacticaApi.createActividad(form, categories);
    }
    if (!saved.backendId) throw new Error('El backend no devolvió el ID de la actividad.');
    await syncChildren(saved.backendId, form, originalActivity);
    await Promise.all([loadPublicData(), loadAdminData()]);
  };

  const handleDeleteActivity = async (activityId: number) => {
    await didacticaApi.deleteActividad(activityId);
    await Promise.all([loadPublicData(), loadAdminData()]);
  };

  const handleChangeStatus = async (activityId: number, status: ActivityStatus) => {
    if (status === 'PUBLICADO') await didacticaApi.publicarActividad(activityId);
    if (status === 'BORRADOR') await didacticaApi.borradorActividad(activityId);
    if (status === 'ARCHIVADO') await didacticaApi.archivarActividad(activityId);
    await Promise.all([loadPublicData(), loadAdminData()]);
  };

  const handleLoadAdminActivity = async (activityId: number) => {
    return didacticaApi.getAdminActividad(activityId);
  };

  const handleOpenActivity = async (activity: Activity) => {
    setSelectedActivity(activity);
    if (!activity.slug || !activity.backendId) return;

    try {
      const fullActivity = await didacticaApi.getPublicActividadBySlug(activity.slug);
      setSelectedActivity(fullActivity);
      setApiStatus(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No fue posible cargar el detalle completo de la actividad.';
      setApiStatus(message);
      console.warn('Activity detail unavailable:', err);
    }
  };

  const getMetricIcon = (iconName: string) => {
    const cls = 'w-6 h-6 text-sage';
    switch (iconName) {
      case 'Sparkles': return <Sparkles className={cls} />;
      case 'Clock': return <Clock className={cls} />;
      case 'Layers': return <Layers className={cls} />;
      case 'Users': return <Users className={cls} />;
      default: return <Sparkles className={cls} />;
    }
  };

  const categoryFilters = useMemo(() => {
    const unique = new Map<ActivityCategory | 'todas', string>();
    unique.set('todas', 'Todos');
    categories.forEach(cat => unique.set(cat.uiCategory, cat.nombre));
    return Array.from(unique, ([value, label]) => ({ value, label }));
  }, [categories]);

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesCategory = selectedCategory === 'todas' || activity.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === '' ||
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.tag.toLowerCase().includes(query) ||
        activity.pedagogicalParadigm.toLowerCase().includes(query) ||
        (activity.materials && activity.materials.some(m => m.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
    });
  }, [activities, selectedCategory, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategory('todas');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-natural-text font-sans selection:bg-sage-light selection:text-sage scroll-smooth antialiased">
      <nav className="sticky top-0 z-40 bg-[#FDFBF7]/85 backdrop-blur-md border-b border-natural-border transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#portfolio-hero" className="flex items-center gap-2 font-serif font-bold text-lg text-natural-dark cursor-pointer">
            <span className="inline-flex p-1.5 rounded-lg bg-sage text-white leading-none"><GraduationCap className="w-5 h-5" /></span>
            <span>Portafolio <span className="text-sage">Didáctica</span></span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-natural-text">
            <a href="#introduccion" className="hover:text-sage transition text-natural-muted hover:text-natural-dark">Introducción</a>
            <a href="#actividades" className="hover:text-sage transition text-natural-muted hover:text-natural-dark">Actividades</a>
            <a href="#reflexiones-finales" className="hover:text-sage transition text-natural-muted hover:text-natural-dark">Cierre</a>
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <button onClick={() => setShowAdminPanel(prev => !prev)} className={`text-xs font-semibold py-1.5 px-3.5 rounded-lg border transition cursor-pointer ${showAdminPanel ? 'bg-sage text-white border-sage shadow-md shadow-sage/10' : 'bg-[#F9F6F2] hover:bg-natural-light-gray text-natural-dark border-natural-border'}`}>
                  {showAdminPanel ? 'Ocultar Panel' : 'Panel Administrador'}
                </button>
                <button onClick={handleLogout} className="text-xs font-semibold bg-terracotta hover:bg-terracotta/90 text-white py-1.5 px-3.5 rounded-lg cursor-pointer transition shadow-sm active:scale-[0.98]">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="text-xs font-semibold bg-sage hover:bg-[#4D5E43] text-white py-1.5 px-3.5 rounded-lg cursor-pointer transition active:scale-[0.98] shadow-sm">
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </nav>

      <Header activities={activities} />

      <main className="space-y-6">
        <Introduction />

        {apiStatus && (
          <section className="max-w-7xl mx-auto px-6">
            <div className="bg-terracotta-light border border-terracotta/20 text-terracotta rounded-2xl p-4 text-sm flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{apiStatus}</span>
            </div>
          </section>
        )}

        <section className="py-10 bg-[#F9F6F2] border-y border-natural-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {DIDACTIC_METRICS.map((metric, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-natural-border shadow-sm flex items-start gap-4 hover:shadow-md transition duration-300">
                  <div className="p-3 bg-sage-light rounded-xl shrink-0">{getMetricIcon(metric.icon)}</div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-natural-dark font-serif leading-tight">{metric.value}</p>
                    <p className="text-xs font-bold text-natural-tag font-serif tracking-tight leading-none uppercase">{metric.label}</p>
                    <p className="text-[10px] text-natural-muted font-sans leading-normal pt-1">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {isLoggedIn && showAdminPanel && (
          <div className="max-w-7xl mx-auto px-6 py-6" id="admin-panel-wrapper">
            <AdminPanel
              activities={adminActivities}
              categories={categories}
              onSaveActivity={handleSaveActivity}
              onDeleteActivity={handleDeleteActivity}
              onChangeStatus={handleChangeStatus}
              onLoadActivity={handleLoadAdminActivity}
              onRefresh={loadAdminData}
              onClose={() => setShowAdminPanel(false)}
              loading={loadingAdmin}
            />
          </div>
        )}

        <section className="py-12" id="actividades">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-natural-border pb-6">
              <div className="space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sage bg-sage-light px-3 py-1 rounded-full font-serif">
                  <Filter className="w-3.5 h-3.5" /> Catálogo de Experiencias
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-natural-dark tracking-tight">Actividades y Proyectos</h2>
                <p className="text-natural-muted text-sm leading-relaxed">Explore las actividades publicadas en el backend del portafolio. Puede filtrar por categoría o buscar por nombre, descripción y materiales.</p>
              </div>
              <button onClick={loadPublicData} disabled={loadingPublic} className="inline-flex items-center justify-center gap-2 text-xs font-bold text-natural-dark bg-white border border-natural-border rounded-xl px-4 py-2.5 hover:bg-natural-light-gray transition disabled:opacity-60">
                <RefreshCw className={`w-4 h-4 ${loadingPublic ? 'animate-spin' : ''}`} /> Actualizar catálogo
              </button>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-natural-border shadow-sm flex flex-col md:flex-row gap-4 items-center sticky top-20 z-30 backdrop-blur-sm bg-white/95">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-tag" />
                <input type="text" placeholder="Buscar por nombre, enfoque, material..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#F9F6F2] border border-natural-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage focus:border-sage text-natural-text placeholder:text-natural-tag" />
              </div>
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                {categoryFilters.map(cat => (
                  <button key={cat.value} onClick={() => setSelectedCategory(cat.value)} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${selectedCategory === cat.value ? 'bg-sage text-white border-sage shadow-md shadow-sage/10' : 'bg-[#F9F6F2] text-natural-text border-natural-border hover:border-sage/30 hover:text-sage'}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} onOpenDetails={handleOpenActivity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-natural-border">
                <div className="inline-flex p-4 bg-natural-light-gray rounded-full mb-4"><X className="w-6 h-6 text-natural-tag" /></div>
                <h3 className="text-xl font-serif font-bold text-natural-dark mb-2">No se encontraron actividades</h3>
                <p className="text-natural-muted text-sm mb-6">Intente ajustar los filtros o publicar actividades desde el panel administrativo.</p>
                <button onClick={handleClearFilters} className="text-sage font-semibold hover:underline text-sm">Limpiar filtros</button>
              </div>
            )}
          </div>
        </section>

        <ReflectionsAndConclusion isLoggedIn={isLoggedIn} />
      </main>

      <footer className="bg-natural-dark text-natural-bg py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-serif font-bold text-lg">Portafolio de Didáctica</p>
            <p className="text-xs text-natural-bg/60">Universidad del Quindío - Facultad de Licenciatura - Materia: Didáctica</p>
          </div>
        </div>
      </footer>

      <ActivityDetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  );
}
