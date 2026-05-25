import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ActivityCategory, ActivityFormData, ActivityStatus, Category, EvidenceItem, LearningItem, MaterialItem } from '../types';
import { Plus, Edit3, Trash2, Save, X, Image as ImageIcon, Info, Loader2, Archive, UploadCloud, Eye, FileText, RefreshCw } from 'lucide-react';

interface AdminPanelProps {
  activities: Activity[];
  categories: Category[];
  onSaveActivity: (data: ActivityFormData, originalActivity?: Activity | null) => Promise<void>;
  onDeleteActivity: (activityId: number) => Promise<void>;
  onChangeStatus: (activityId: number, status: ActivityStatus) => Promise<void>;
  onLoadActivity: (activityId: number) => Promise<Activity>;
  onRefresh: () => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

type EvidenceDraft = EvidenceItem & {
  localPreview?: string;
  file?: File;
  isNew?: boolean;
};

const DEFAULT_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  juegos: 'Juegos Didácticos',
  dinamicas: 'Dinámicas Grupales',
  aula: 'Actividades de Aula',
  proyectos: 'Proyectos Creativos',
  evidencias: 'Evidencias del Proceso',
  reflexiones: 'Reflexiones y Diarios',
  otros: 'Otras Actividades',
};

export default function AdminPanel({
  activities,
  categories,
  onSaveActivity,
  onDeleteActivity,
  onChangeStatus,
  onLoadActivity,
  onRefresh,
  onClose,
  loading = false,
}: AdminPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('juegos');
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined);
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [materials, setMaterials] = useState<MaterialItem[]>([{ nombre: '' }]);
  const [targetGroup, setTargetGroup] = useState('');
  const [learnings, setLearnings] = useState<LearningItem[]>([{ descripcion: '', orden: 0 }]);
  const [reflection, setReflection] = useState('');
  const [evidences, setEvidences] = useState<EvidenceDraft[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Medio' | 'Avanzado'>('Medio');
  const [preparationTime, setPreparationTime] = useState('30 mins');
  const [pedagogicalParadigm, setPedagogicalParadigm] = useState('Didáctica activa');
  const [estado, setEstado] = useState<ActivityStatus>('PUBLICADO');
  const [destacado, setDestacado] = useState(false);
  const [fechaRealizacion, setFechaRealizacion] = useState('');
  const [lugar, setLugar] = useState('');

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => (a.orden || 0) - (b.orden || 0));
  }, [categories]);

  useEffect(() => {
    if (!categoriaId && sortedCategories.length > 0) {
      setCategoriaId(sortedCategories[0].id);
      setCategory(sortedCategories[0].uiCategory);
    }
  }, [categoriaId, sortedCategories]);

  useEffect(() => {
    return () => {
      evidences.forEach(e => {
        if (e.localPreview) URL.revokeObjectURL(e.localPreview);
      });
    };
  }, [evidences]);

  const resetForm = () => {
    const first = sortedCategories[0];
    setEditingActivity(null);
    setTitle('');
    setCategory(first?.uiCategory || 'juegos');
    setCategoriaId(first?.id);
    setTag('');
    setDescription('');
    setObjective('');
    setMaterials([{ nombre: '' }]);
    setTargetGroup('');
    setLearnings([{ descripcion: '', orden: 0 }]);
    setReflection('');
    setEvidences([]);
    setImageUrlInput('');
    setDifficulty('Medio');
    setPreparationTime('30 mins');
    setPedagogicalParadigm('Didáctica activa');
    setEstado('PUBLICADO');
    setDestacado(false);
    setFechaRealizacion('');
    setLugar('');
    setError(null);
  };

  const fillForm = (activity: Activity) => {
    setEditingActivity(activity);
    setTitle(activity.title);
    setCategory(activity.category);
    setCategoriaId(activity.categoriaId);
    setTag(activity.tag || 'Didáctica activa');
    setDescription(activity.description || '');
    setObjective(activity.objective || '');
    setMaterials(activity.materialItems?.length ? activity.materialItems.map(m => ({ ...m })) : [{ nombre: '' }]);
    setTargetGroup(activity.targetGroup || '');
    setLearnings(activity.learningItems?.length ? activity.learningItems.map((l, idx) => ({ ...l, orden: l.orden ?? idx })) : [{ descripcion: '', orden: 0 }]);
    setReflection(activity.reflection || '');
    setEvidences(activity.evidenceItems?.length ? activity.evidenceItems.map(e => ({ ...e })) : []);
    setImageUrlInput('');
    setDifficulty(activity.difficulty || 'Medio');
    setPreparationTime(activity.preparationTime || '30 mins');
    setPedagogicalParadigm(activity.pedagogicalParadigm || 'Didáctica activa');
    setEstado(activity.estado || 'PUBLICADO');
    setDestacado(Boolean(activity.destacado));
    setFechaRealizacion(activity.fechaRealizacion || '');
    setLugar(activity.lugar || '');
    setError(null);
  };

  const handleStartCreate = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleStartEdit = async (activity: Activity) => {
    setSubmitting(true);
    setError(null);
    try {
      const full = activity.backendId ? await onLoadActivity(activity.backendId) : activity;
      fillForm(full);
      setIsEditing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible cargar el detalle de la actividad.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryChange = (idValue: string) => {
    const id = Number(idValue);
    const selected = sortedCategories.find(c => c.id === id);
    setCategoriaId(id);
    if (selected) {
      setCategory(selected.uiCategory);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const newDrafts: EvidenceDraft[] = files.map((file, idx) => ({
      urlArchivo: '',
      titulo: file.name || `Evidencia ${evidences.length + idx + 1}`,
      descripcion: 'Evidencia cargada desde el dispositivo.',
      tipo: 'IMAGEN',
      orden: evidences.length + idx,
      esPortada: evidences.length === 0 && idx === 0,
      localPreview: URL.createObjectURL(file),
      file,
      isNew: true,
    }));

    setEvidences(prev => [...prev, ...newDrafts]);
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setEvidences(prev => [
      ...prev,
      {
        urlArchivo: url,
        titulo: `Evidencia ${prev.length + 1}`,
        descripcion: 'Evidencia agregada por URL.',
        tipo: 'IMAGEN',
        orden: prev.length,
        esPortada: prev.length === 0,
        isNew: true,
      }
    ]);
    setImageUrlInput('');
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidences(prev => {
      const item = prev[index];
      if (item?.localPreview) URL.revokeObjectURL(item.localPreview);
      return prev.filter((_, i) => i !== index).map((e, idx) => ({ ...e, orden: idx, esPortada: idx === 0 }));
    });
  };

  const handleAddMaterial = () => setMaterials(prev => [...prev, { nombre: '' }]);
  const handleMaterialChange = (index: number, field: keyof MaterialItem, value: string) => {
    setMaterials(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };
  const handleRemoveMaterial = (index: number) => setMaterials(prev => prev.filter((_, i) => i !== index));

  const handleAddLearning = () => setLearnings(prev => [...prev, { descripcion: '', orden: prev.length }]);
  const handleLearningChange = (index: number, value: string) => {
    setLearnings(prev => prev.map((l, i) => i === index ? { ...l, descripcion: value, orden: i } : l));
  };
  const handleRemoveLearning = (index: number) => setLearnings(prev => prev.filter((_, i) => i !== index).map((l, idx) => ({ ...l, orden: idx })));

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !categoriaId) {
      setError('Complete los campos obligatorios: nombre, categoría y descripción.');
      return;
    }

    const cleanMaterials = materials
      .map(m => ({ ...m, nombre: m.nombre.trim(), cantidad: m.cantidad?.trim(), descripcion: m.descripcion?.trim() }))
      .filter(m => m.nombre.length > 0);
    const cleanLearnings = learnings
      .map((l, idx) => ({ ...l, descripcion: l.descripcion.trim(), orden: idx }))
      .filter(l => l.descripcion.length > 0);

    const newFiles = evidences.filter(e => e.file).map(e => e.file!) as File[];
    const newUrls = evidences.filter(e => e.isNew && !e.file && e.urlArchivo).map(e => e.urlArchivo);
    const existingEvidence = evidences.filter(e => e.id && !e.file);

    const payload: ActivityFormData = {
      backendId: editingActivity?.backendId,
      title: title.trim(),
      category,
      categoriaId,
      tag: tag.trim(),
      description: description.trim(),
      objective: objective.trim() || 'Fortalecer competencias pedagógicas mediante una experiencia didáctica activa.',
      materials: cleanMaterials,
      targetGroup: targetGroup.trim() || 'Estudiantes en general',
      learnings: cleanLearnings.length ? cleanLearnings : [{ descripcion: 'Se fortaleció la comprensión de la didáctica como práctica activa.', orden: 0 }],
      reflection: reflection.trim() || 'La actividad permitió reconocer el valor de diseñar experiencias pedagógicas significativas.',
      evidenceItems: existingEvidence,
      newEvidenceFiles: newFiles,
      newEvidenceUrls: newUrls,
      difficulty,
      preparationTime: preparationTime.trim() || '30 mins',
      pedagogicalParadigm: pedagogicalParadigm.trim() || tag.trim() || 'Didáctica activa',
      estado,
      destacado,
      orden: editingActivity?.orden || 0,
      fechaRealizacion: fechaRealizacion || undefined,
      lugar: lugar.trim() || undefined,
    };

    setSubmitting(true);
    try {
      await onSaveActivity(payload, editingActivity);
      setIsEditing(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible guardar la actividad.');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = sortedCategories.length ? sortedCategories : [{ id: 0, nombre: DEFAULT_CATEGORY_LABELS.juegos, slug: 'juegos', uiCategory: 'juegos' as ActivityCategory }];

  return (
    <div className="bg-white rounded-3xl border border-natural-border p-6 sm:p-8 space-y-6 shadow-xl shadow-sage/5 transition duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-natural-border pb-5">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-sage bg-sage-light border border-sage/20 px-2.5 py-1 rounded-full font-bold">
            Consola Administrativa
          </span>
          <h2 className="text-2xl font-serif font-bold text-natural-dark">Gestión del Portafolio</h2>
          <p className="text-xs text-natural-muted">Los cambios se guardan directamente en el backend Spring Boot.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isEditing && (
            <button onClick={handleStartCreate} className="inline-flex items-center gap-1.5 px-4 py-2 bg-sage hover:bg-[#4D5E43] text-white font-semibold text-xs rounded-xl cursor-pointer transition shadow-md shadow-sage/10">
              <Plus className="w-4 h-4" /> Nueva Actividad
            </button>
          )}
          <button onClick={onRefresh} disabled={loading || submitting} className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-natural-border text-natural-dark font-semibold text-xs rounded-xl cursor-pointer transition hover:bg-natural-light-gray disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualizar
          </button>
          <button onClick={onClose} className="inline-flex items-center gap-1 px-3 py-2 bg-natural-light-gray border border-natural-border text-natural-dark font-semibold text-xs rounded-xl cursor-pointer transition hover:bg-[#F3F0EC]">
            <X className="w-3.5 h-3.5" /> Ocultar panel
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-terracotta-light border border-terracotta/20 text-terracotta text-sm flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSaveSubmit} className="space-y-6 animate-fade-in">
          <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-natural-border space-y-2">
            <h3 className="text-sm font-bold text-natural-dark font-serif">
              {editingActivity ? 'Editar actividad existente' : 'Crear nueva actividad o proyecto'}
            </h3>
            <p className="text-xs text-natural-muted leading-normal">Complete los datos didácticos. Las evidencias se enviarán al backend y, si son archivos, el backend las subirá a Cloudinary.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Nombre de la actividad *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage" placeholder="Ej. Bingo de fracciones" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Categoría *</label>
                  <select value={categoriaId ?? ''} onChange={(e) => handleCategoryChange(e.target.value)} required className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage">
                    {categoryOptions.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Estado</label>
                  <select value={estado} onChange={(e) => setEstado(e.target.value as ActivityStatus)} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage">
                    <option value="PUBLICADO">Publicado</option>
                    <option value="BORRADOR">Borrador</option>
                    <option value="ARCHIVADO">Archivado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Descripción *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage resize-none" placeholder="Explique en qué consistió la actividad." />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Objetivo didáctico</label>
                <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={3} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage resize-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Metodología / paradigma</label>
                  <input value={pedagogicalParadigm} onChange={(e) => setPedagogicalParadigm(e.target.value)} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Etiqueta visible</label>
                  <input value={tag} onChange={(e) => setTag(e.target.value)} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage" placeholder="Gamificación, DUA, etc." />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Público objetivo</label>
                  <input value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Lugar</label>
                  <input value={lugar} onChange={(e) => setLugar(e.target.value)} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Fecha</label>
                  <input type="date" value={fechaRealizacion} onChange={(e) => setFechaRealizacion(e.target.value)} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Dificultad</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as 'Fácil' | 'Medio' | 'Avanzado')} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage">
                    <option>Fácil</option><option>Medio</option><option>Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Tiempo de preparación</label>
                <input value={preparationTime} onChange={(e) => setPreparationTime(e.target.value)} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage" />
              </div>

              <div className="border border-natural-border bg-[#FDFBF7] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-natural-dark uppercase tracking-wider font-mono">Aprendizajes</label>
                  <button type="button" onClick={handleAddLearning} className="text-xs font-bold text-sage flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Agregar</button>
                </div>
                {learnings.map((learning, idx) => (
                  <div key={learning.id || idx} className="flex gap-2">
                    <input value={learning.descripcion} onChange={(e) => handleLearningChange(idx, e.target.value)} placeholder={`Aprendizaje #${idx + 1}`} className="flex-1 bg-white border border-natural-border rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-sage" />
                    {learnings.length > 1 && <button type="button" onClick={() => handleRemoveLearning(idx)} className="p-2 bg-terracotta-light text-terracotta rounded-lg"><X className="w-3.5 h-3.5" /></button>}
                  </div>
                ))}
              </div>

              <div className="border border-natural-border bg-white rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-natural-dark uppercase tracking-wider font-mono">Materiales</label>
                  <button type="button" onClick={handleAddMaterial} className="text-xs font-bold text-sage flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Agregar</button>
                </div>
                {materials.map((m, idx) => (
                  <div key={m.id || idx} className="grid grid-cols-12 gap-2">
                    <input value={m.nombre} onChange={(e) => handleMaterialChange(idx, 'nombre', e.target.value)} placeholder="Material" className="col-span-7 bg-white border border-natural-border rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-sage" />
                    <input value={m.cantidad || ''} onChange={(e) => handleMaterialChange(idx, 'cantidad', e.target.value)} placeholder="Cant." className="col-span-3 bg-white border border-natural-border rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-sage" />
                    {materials.length > 1 && <button type="button" onClick={() => handleRemoveMaterial(idx)} className="col-span-2 p-2 bg-terracotta-light text-terracotta rounded-lg"><X className="w-3.5 h-3.5 mx-auto" /></button>}
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono">Reflexión final</label>
                <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} rows={4} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-sage resize-none" />
              </div>
            </div>
          </div>

          <div className="border border-natural-border rounded-2xl p-4 space-y-4 bg-[#FDFBF7]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-serif font-bold text-natural-dark flex items-center gap-2"><ImageIcon className="w-4 h-4 text-sage" /> Evidencias</h4>
                <p className="text-xs text-natural-muted">Suba imágenes desde el dispositivo o agregue una URL. La primera evidencia será portada.</p>
              </div>
              <label className="inline-flex items-center gap-2 bg-sage text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#4D5E43]">
                <UploadCloud className="w-4 h-4" /> Subir imágenes
                <input type="file" accept="image/*" multiple onChange={handleImageFileChange} className="hidden" />
              </label>
            </div>
            <div className="flex gap-2">
              <input value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="https://..." className="flex-1 bg-white border border-natural-border rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-sage" />
              <button type="button" onClick={handleAddImageUrl} className="px-4 py-2 bg-white border border-natural-border rounded-xl text-xs font-bold text-natural-dark hover:bg-natural-light-gray">Agregar URL</button>
            </div>
            {evidences.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {evidences.map((evidence, idx) => (
                  <div key={`${evidence.id || evidence.localPreview || evidence.urlArchivo}-${idx}`} className="relative group rounded-xl overflow-hidden border border-natural-border bg-white aspect-square">
                    <img src={evidence.localPreview || evidence.urlArchivo} alt={evidence.titulo || `Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && <span className="absolute top-2 left-2 bg-sage text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Portada</span>}
                    <button type="button" onClick={() => handleRemoveEvidence(idx)} className="absolute top-2 right-2 bg-white/90 text-terracotta rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-natural-border rounded-xl p-6 text-center text-xs text-natural-muted">Aún no se han agregado evidencias.</div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input id="destacado" type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} className="w-4 h-4 accent-sage" />
            <label htmlFor="destacado" className="text-xs font-bold text-natural-dark">Marcar como artefacto destacado</label>
          </div>

          <div className="flex justify-end gap-3 border-t border-natural-border pt-4">
            <button type="button" disabled={submitting} onClick={() => { setIsEditing(false); resetForm(); }} className="px-5 py-2.5 bg-white border border-natural-border text-natural-dark hover:bg-natural-light-gray font-semibold rounded-xl text-xs transition cursor-pointer disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sage hover:bg-[#4D5E43] text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-md shadow-sage/10 disabled:opacity-70">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar en backend
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#F9F6F2] border border-natural-border p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-sage shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-natural-dark font-serif">Panel conectado al backend</p>
              <p className="text-[11px]/relaxed text-natural-muted">Aquí se listan actividades administrativas. Las publicadas aparecerán en la vista pública del portafolio.</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-natural-border rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-xs text-natural-text border-collapse">
              <thead className="bg-[#FDFBF7] border-b border-natural-border font-serif text-natural-dark font-bold">
                <tr>
                  <th className="p-3.5 pl-5">Actividad</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5">Evidencias</th>
                  <th className="p-3.5 pr-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-natural-border/60">
                {activities.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-natural-muted">No hay actividades administrativas para mostrar.</td></tr>
                )}
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-[#FDFBF7]/50 transition duration-150">
                    <td className="p-3.5 pl-5">
                      <div className="space-y-0.5 max-w-sm">
                        <p className="font-bold text-natural-dark font-serif truncate">{act.title}</p>
                        <p className="text-[10px] text-natural-muted font-sans truncate">{act.description}</p>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono"><span className="px-2 py-0.5 bg-sage-light text-sage border border-sage/15 rounded text-[10px]">{act.categoryLabel}</span></td>
                    <td className="p-3.5"><span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${act.estado === 'PUBLICADO' ? 'bg-sage-light text-sage' : act.estado === 'ARCHIVADO' ? 'bg-terracotta-light text-terracotta' : 'bg-natural-light-gray text-natural-tag'}`}>{act.estado || 'PUBLICADO'}</span></td>
                    <td className="p-3.5"><div className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-natural-tag" /><span className="font-mono text-[11px] font-bold text-natural-dark">{act.evidenceImages.length} fotos</span></div></td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="inline-flex flex-wrap justify-end gap-1.5">
                        {act.backendId && act.estado !== 'PUBLICADO' && <button onClick={() => onChangeStatus(act.backendId!, 'PUBLICADO')} className="p-1.5 bg-white hover:bg-sage-light hover:text-sage text-natural-muted border border-natural-border rounded-lg" title="Publicar"><Eye className="w-3.5 h-3.5" /></button>}
                        {act.backendId && act.estado !== 'BORRADOR' && <button onClick={() => onChangeStatus(act.backendId!, 'BORRADOR')} className="p-1.5 bg-white hover:bg-natural-light-gray text-natural-muted border border-natural-border rounded-lg" title="Pasar a borrador"><FileText className="w-3.5 h-3.5" /></button>}
                        {act.backendId && act.estado !== 'ARCHIVADO' && <button onClick={() => onChangeStatus(act.backendId!, 'ARCHIVADO')} className="p-1.5 bg-white hover:bg-terracotta-light hover:text-terracotta text-natural-muted border border-natural-border rounded-lg" title="Archivar"><Archive className="w-3.5 h-3.5" /></button>}
                        <button onClick={() => handleStartEdit(act)} disabled={submitting} className="p-1.5 bg-white hover:bg-sage-light hover:text-sage text-natural-muted border border-natural-border hover:border-sage/35 rounded-lg transition cursor-pointer" title="Editar actividad"><Edit3 className="w-3.5 h-3.5" /></button>
                        {act.backendId && <button onClick={() => { if (confirm(`¿Eliminar la actividad "${act.title}"?`)) onDeleteActivity(act.backendId!); }} className="p-1.5 bg-white hover:bg-terracotta-light hover:text-terracotta text-natural-muted border border-natural-border hover:border-terracotta/35 rounded-lg transition cursor-pointer" title="Eliminar actividad"><Trash2 className="w-3.5 h-3.5" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
