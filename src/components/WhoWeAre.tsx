import React, { useEffect, useState } from 'react';
import { AlertCircle, Camera, Edit3, Loader2, Save, UploadCloud, Users, X } from 'lucide-react';
import { didacticaApi } from '../services/api';
import { GroupInfo } from '../types';

interface WhoWeAreProps {
  isLoggedIn?: boolean;
}

const DEFAULT_GROUP_INFO: GroupInfo = {
  titulo: '¿Quiénes somos?',
  descripcion: 'Somos un grupo de estudiantes comprometidos con la construcción de experiencias didácticas significativas. Este portafolio reúne nuestras actividades, reflexiones y aprendizajes como evidencia del trabajo colaborativo desarrollado durante el curso.',
  integrantes: ['Leonardo', 'Oveimar', 'Maria', 'Veronica'],
  imagenUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
  activo: true,
};

export default function WhoWeAre({ isLoggedIn = false }: WhoWeAreProps) {
  const [groupInfo, setGroupInfo] = useState<GroupInfo>(DEFAULT_GROUP_INFO);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<GroupInfo>(DEFAULT_GROUP_INFO);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadGroupInfo();
  }, [isLoggedIn]);

  const loadGroupInfo = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = isLoggedIn
        ? await didacticaApi.getAdminGroupInfo()
        : await didacticaApi.getPublicGroupInfo();
      setGroupInfo(data);
      setDraft(data);
    } catch (err) {
      setGroupInfo(DEFAULT_GROUP_INFO);
      setDraft(DEFAULT_GROUP_INFO);
      if (isLoggedIn) {
        setMessage(err instanceof Error ? err.message : 'No fue posible cargar la información del grupo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setDraft({ ...groupInfo, integrantes: [...groupInfo.integrantes] });
    setIsEditing(true);
    setMessage(null);
  };

  const saveChanges = async () => {
    const cleaned: GroupInfo = {
      ...draft,
      titulo: draft.titulo.trim() || DEFAULT_GROUP_INFO.titulo,
      descripcion: draft.descripcion.trim() || DEFAULT_GROUP_INFO.descripcion,
      imagenUrl: draft.imagenUrl.trim() || DEFAULT_GROUP_INFO.imagenUrl,
      integrantes: draft.integrantes.map(member => member.trim()).filter(Boolean),
      activo: draft.activo ?? true,
    };

    setSaving(true);
    setMessage(null);
    try {
      const saved = await didacticaApi.updateGroupInfo(cleaned);
      setGroupInfo(saved);
      setDraft(saved);
      setIsEditing(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'No fue posible guardar la información del grupo.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadingImage(true);
    setMessage(null);
    try {
      const saved = await didacticaApi.uploadGroupImage(file);
      setGroupInfo(saved);
      setDraft(saved);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'No fue posible subir la imagen.');
    } finally {
      setUploadingImage(false);
    }
  };

  if (!isLoggedIn && groupInfo.activo === false) return null;

  return (
    <section className="py-14 bg-[#F9F6F2] border-y border-natural-border" id="quienes-somos">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-natural-border bg-natural-light-gray aspect-[4/3] shadow-sm">
              <img
                src={groupInfo.imagenUrl || DEFAULT_GROUP_INFO.imagenUrl}
                alt="Integrantes del grupo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm text-natural-dark text-xs font-bold border border-white/50">
                <Camera className="w-3.5 h-3.5 text-sage" />
                Grupo de trabajo
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sage bg-sage-light px-3 py-1 rounded-full font-serif">
                  <Users className="w-3.5 h-3.5" /> Equipo
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-natural-dark tracking-tight">
                  {groupInfo.titulo}
                </h2>
              </div>
              {isLoggedIn && !isEditing && (
                <button onClick={startEditing} disabled={loading} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-natural-border text-sage text-xs font-bold hover:bg-sage-light disabled:opacity-60">
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Edit3 className="w-3.5 h-3.5" />}
                  Editar sección
                </button>
              )}
            </div>

            {message && (
              <div className="bg-terracotta-light border border-terracotta/20 text-terracotta rounded-2xl p-3 text-xs flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {isEditing ? (
              <div className="bg-white border border-natural-border rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Título</span>
                    <input value={draft.titulo} onChange={(e) => setDraft({ ...draft, titulo: e.target.value })} className="w-full bg-[#FDFBF7] border border-natural-border rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-sage" />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Imagen</span>
                    <input value={draft.imagenUrl} onChange={(e) => setDraft({ ...draft, imagenUrl: e.target.value })} className="w-full bg-[#FDFBF7] border border-natural-border rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-sage" />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 bg-sage text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#4D5E43] disabled:opacity-60">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    Subir imagen desde el dispositivo
                    <input type="file" accept="image/*" onChange={handleImageFileChange} disabled={uploadingImage} className="hidden" />
                  </label>
                  <span className="text-[11px] text-natural-muted">También puede pegar una URL en el campo de imagen.</span>
                </div>

                <label className="space-y-1.5 block">
                  <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Descripción</span>
                  <textarea value={draft.descripcion} onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })} rows={4} className="w-full bg-[#FDFBF7] border border-natural-border rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-sage resize-none" />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Integrantes, uno por línea</span>
                  <textarea value={draft.integrantes.join('\n')} onChange={(e) => setDraft({ ...draft, integrantes: e.target.value.split('\n') })} rows={4} className="w-full bg-[#FDFBF7] border border-natural-border rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-sage resize-none" />
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={draft.activo ?? true} onChange={(e) => setDraft({ ...draft, activo: e.target.checked })} className="w-4 h-4 accent-sage" />
                  <span className="text-xs font-bold text-natural-dark">Mostrar sección al público</span>
                </label>

                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditing(false)} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-natural-light-gray border border-natural-border text-natural-dark text-xs font-bold disabled:opacity-60">
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </button>
                  <button onClick={saveChanges} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage text-white text-xs font-bold hover:bg-[#4D5E43] disabled:opacity-70">
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-natural-text text-base leading-relaxed max-w-3xl">
                  {groupInfo.descripcion}
                </p>
                <div className="flex flex-wrap gap-2">
                  {groupInfo.integrantes.map(member => (
                    <span key={member} className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-natural-border text-natural-dark text-xs font-bold shadow-sm">
                      {member}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
