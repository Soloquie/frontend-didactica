import React, { useState } from 'react';
import { Loader2, Plus, Save, Trash2, UploadCloud, X } from 'lucide-react';
import { GroupInfo, GroupMember } from '../types';
import { didacticaApi } from '../services/api';

interface AdminMembersEditorProps {
  groupInfo: GroupInfo;
  onCancel: () => void;
  onSaved: (groupInfo: GroupInfo) => void;
  onError: (message: string) => void;
}

const EMPTY_MEMBER: GroupMember = {
  nombre: '',
  descripcion: '',
  imagenUrl: '',
};

export default function AdminMembersEditor({ groupInfo, onCancel, onSaved, onError }: AdminMembersEditorProps) {
  const [draft, setDraft] = useState<GroupInfo>({
    ...groupInfo,
    integrantes: groupInfo.integrantes.map(member => ({ ...member })),
  });
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const updateMember = (index: number, changes: Partial<GroupMember>) => {
    setDraft(prev => ({
      ...prev,
      integrantes: prev.integrantes.map((member, ix) => ix === index ? { ...member, ...changes } : member),
    }));
  };

  const addMember = () => {
    setDraft(prev => ({
      ...prev,
      integrantes: [...prev.integrantes, { ...EMPTY_MEMBER }],
    }));
  };

  const removeMember = (index: number) => {
    setDraft(prev => ({
      ...prev,
      integrantes: prev.integrantes.filter((_, ix) => ix !== index),
    }));
  };

  const save = async () => {
    const cleaned: GroupInfo = {
      ...draft,
      titulo: draft.titulo.trim() || '¿Quiénes somos?',
      integrantes: draft.integrantes
        .map(member => ({
          nombre: (member.nombre || '').trim(),
          descripcion: (member.descripcion || '').trim(),
          imagenUrl: (member.imagenUrl || '').trim(),
        }))
        .filter(member => member.nombre.length > 0),
      activo: draft.activo ?? true,
    };

    setSaving(true);
    try {
      const saved = await didacticaApi.updateGroupInfo(cleaned);
      onSaved(saved);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'No fue posible guardar los integrantes.');
    } finally {
      setSaving(false);
    }
  };

  const uploadMemberImage = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadingIndex(index);
    try {
      await didacticaApi.updateGroupInfo(draft);
      const savedWithImage = await didacticaApi.uploadMemberImage(index, file);
      setDraft({
        ...savedWithImage,
        integrantes: savedWithImage.integrantes.map(member => ({ ...member })),
      });
      onSaved(savedWithImage);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'No fue posible subir la imagen del integrante.');
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="bg-white border border-natural-border rounded-3xl p-6 space-y-5 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Título de la sección</span>
          <input value={draft.titulo} onChange={(e) => setDraft({ ...draft, titulo: e.target.value })} className="w-full bg-[#FDFBF7] border border-natural-border rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-sage" />
        </label>
        <label className="flex items-center gap-3 pt-6">
          <input type="checkbox" checked={draft.activo ?? true} onChange={(e) => setDraft({ ...draft, activo: e.target.checked })} className="w-4 h-4 accent-sage" />
          <span className="text-xs font-bold text-natural-dark">Mostrar sección al público</span>
        </label>
      </div>

      <div className="space-y-4">
        {draft.integrantes.map((member, index) => (
          <div key={index} className="border border-natural-border rounded-2xl p-4 bg-[#FDFBF7] space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-natural-dark font-serif">Integrante {index + 1}</p>
              <button onClick={() => removeMember(index)} className="inline-flex items-center gap-1 text-xs font-bold text-terracotta bg-terracotta-light px-2.5 py-1.5 rounded-lg">
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Nombre</span>
                <input value={member.nombre} onChange={(e) => updateMember(index, { nombre: e.target.value })} className="w-full bg-white border border-natural-border rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-sage" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Imagen</span>
                <input value={member.imagenUrl} onChange={(e) => updateMember(index, { imagenUrl: e.target.value })} className="w-full bg-white border border-natural-border rounded-xl py-2.5 px-3 text-sm focus:ring-1 focus:ring-sage" />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 bg-sage text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#4D5E43]">
                {uploadingIndex === index ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                Subir foto
                <input type="file" accept="image/*" onChange={(event) => uploadMemberImage(index, event)} disabled={uploadingIndex !== null} className="hidden" />
              </label>
              <span className="text-[11px] text-natural-muted">También puede pegar una URL.</span>
            </div>

            <label className="space-y-1.5 block">
              <span className="text-[10px] font-bold text-natural-tag uppercase tracking-wider font-mono">Descripción</span>
              <textarea value={member.descripcion} onChange={(e) => updateMember(index, { descripcion: e.target.value })} rows={3} className="w-full bg-white border border-natural-border rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-sage resize-none" />
            </label>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={addMember} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-natural-border text-sage text-xs font-bold hover:bg-sage-light">
          <Plus className="w-3.5 h-3.5" /> Agregar integrante
        </button>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-natural-light-gray border border-natural-border text-natural-dark text-xs font-bold disabled:opacity-60">
            <X className="w-3.5 h-3.5" /> Cancelar
          </button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage text-white text-xs font-bold hover:bg-[#4D5E43] disabled:opacity-70">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
