import React, { useEffect, useState } from 'react';
import { AlertCircle, Edit3, Loader2, Users } from 'lucide-react';
import { didacticaApi } from '../services/api';
import { GroupInfo } from '../types';
import AdminMembersEditor from './AdminMembersEditor';
import MembersCarousel from './MembersCarousel';

interface WhoWeAreProps {
  isLoggedIn?: boolean;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80';

const DEFAULT_GROUP_INFO: GroupInfo = {
  titulo: '¿Quiénes somos?',
  descripcion: 'Equipo de trabajo del portafolio de Didáctica.',
  integrantes: ['Leonardo', 'Oveimar', 'Maria', 'Veronica'].map(nombre => ({
    nombre,
    descripcion: 'Integrante del equipo de trabajo del portafolio de Didáctica.',
    imagenUrl: DEFAULT_IMAGE,
  })),
  imagenUrl: DEFAULT_IMAGE,
  activo: true,
};

export default function WhoWeAre({ isLoggedIn = false }: WhoWeAreProps) {
  const [groupInfo, setGroupInfo] = useState<GroupInfo>(DEFAULT_GROUP_INFO);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
      setGroupInfo(normalizeGroupInfo(data));
    } catch (err) {
      setGroupInfo(DEFAULT_GROUP_INFO);
      if (isLoggedIn) {
        setMessage(err instanceof Error ? err.message : 'No fue posible cargar la información de integrantes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaved = (saved: GroupInfo) => {
    setGroupInfo(normalizeGroupInfo(saved));
    setIsEditing(false);
    setMessage(null);
  };

  if (!isLoggedIn && groupInfo.activo === false) return null;

  return (
    <section className="py-14 bg-[#F9F6F2] border-y border-natural-border" id="quienes-somos">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sage bg-sage-light px-3 py-1 rounded-full font-serif">
              <Users className="w-3.5 h-3.5" /> Equipo
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-natural-dark tracking-tight">
              {groupInfo.titulo || '¿Quiénes somos?'}
            </h2>
          </div>

          {isLoggedIn && !isEditing && (
            <button onClick={() => setIsEditing(true)} disabled={loading} className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-natural-border text-sage text-xs font-bold hover:bg-sage-light disabled:opacity-60">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Edit3 className="w-3.5 h-3.5" />}
              Editar integrantes
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
          <AdminMembersEditor
            groupInfo={groupInfo}
            onCancel={() => setIsEditing(false)}
            onSaved={handleSaved}
            onError={setMessage}
          />
        ) : (
          <MembersCarousel members={groupInfo.integrantes} />
        )}
      </div>
    </section>
  );
}

function normalizeGroupInfo(groupInfo: GroupInfo): GroupInfo {
  return {
    ...DEFAULT_GROUP_INFO,
    ...groupInfo,
    integrantes: (groupInfo.integrantes || []).map(member => {
      if (typeof member === 'string') {
        return {
          nombre: member,
          descripcion: 'Integrante del equipo de trabajo del portafolio de Didáctica.',
          imagenUrl: groupInfo.imagenUrl || DEFAULT_IMAGE,
        };
      }
      return {
        nombre: member.nombre || 'Integrante',
        descripcion: member.descripcion || 'Integrante del equipo de trabajo del portafolio de Didáctica.',
        imagenUrl: member.imagenUrl || groupInfo.imagenUrl || DEFAULT_IMAGE,
      };
    }),
  };
}
