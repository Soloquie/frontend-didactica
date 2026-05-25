import { Activity, ActivityCategory, ActivityFormData, AuthUser, Category, EvidenceItem, LearningItem, MaterialItem, PortafolioInfo } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const TOKEN_KEY = 'didactica_auth_token';
const USER_KEY = 'didactica_auth_user';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80';

type BackendCategoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  orden?: number;
  activo?: boolean;
};

type BackendEvidencia = {
  id?: number;
  titulo?: string;
  descripcion?: string;
  tipo?: 'IMAGEN' | 'VIDEO' | 'DOCUMENTO';
  urlArchivo?: string;
  nombreArchivo?: string;
  mimeType?: string;
  pesoBytes?: number;
  orden?: number;
  esPortada?: boolean;
};

type BackendAprendizaje = { id?: number; descripcion: string; orden?: number };
type BackendMaterial = { id?: number; nombre: string; cantidad?: string; descripcion?: string };

type BackendActividad = {
  id: number;
  categoria?: BackendCategoria;
  nombre: string;
  slug?: string;
  tipo?: 'ACTIVIDAD' | 'PROYECTO';
  estado?: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';
  resumen?: string;
  descripcion?: string;
  objetivoDidactico?: string;
  metodologia?: string;
  publicoObjetivo?: string;
  lugar?: string;
  fechaRealizacion?: string;
  portadaUrl?: string;
  reflexionFinal?: string;
  destacado?: boolean;
  orden?: number;
  evidencias?: BackendEvidencia[];
  aprendizajes?: BackendAprendizaje[];
  materiales?: BackendMaterial[];
};

type LoginResponse = {
  token: string;
  tipo?: string;
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'EDITOR';
};

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  const token = getToken();
  if (!raw || !token) return null;
  try {
    return { ...JSON.parse(raw), token } as AuthUser;
  } catch {
    clearAuth();
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function saveAuth(response: LoginResponse): AuthUser {
  const user: AuthUser = {
    token: response.token,
    tipo: response.tipo || 'Bearer',
    nombre: response.nombre,
    correo: response.correo,
    rol: response.rol,
  };
  localStorage.setItem(TOKEN_KEY, user.token);
  localStorage.setItem(USER_KEY, JSON.stringify({
    tipo: user.tipo,
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol,
  }));
  return user;
}

async function request<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getToken();
    if (!token) throw new Error('No hay una sesión administrativa activa.');
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const data = text ? safeJson(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.error || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

function safeJson(text: string) {
  try { return JSON.parse(text); } catch { return text; }
}

export function mapCategory(backend: BackendCategoria): Category {
  return {
    ...backend,
    uiCategory: inferUiCategory(backend.slug || backend.nombre),
  };
}

export function inferUiCategory(value?: string): ActivityCategory {
  const text = (value || '').toLowerCase();
  if (text.includes('juego')) return 'juegos';
  if (text.includes('dinam')) return 'dinamicas';
  if (text.includes('aula')) return 'aula';
  if (text.includes('proyecto') || text.includes('creativo')) return 'proyectos';
  if (text.includes('evidenc')) return 'evidencias';
  if (text.includes('reflex')) return 'reflexiones';
  return 'otros';
}

function defaultCategoryLabel(category: ActivityCategory) {
  const labels: Record<ActivityCategory, string> = {
    juegos: 'Juegos Didácticos',
    dinamicas: 'Dinámicas Grupales',
    aula: 'Actividades de Aula',
    proyectos: 'Proyectos Creativos',
    evidencias: 'Evidencias del Proceso',
    reflexiones: 'Reflexiones y Diarios',
    otros: 'Otras Actividades',
  };
  return labels[category];
}

export function mapActivity(backend: BackendActividad): Activity {
  const category = inferUiCategory(backend.categoria?.slug || backend.categoria?.nombre || backend.tipo);
  const evidences = (backend.evidencias || [])
    .filter(e => !!e.urlArchivo)
    .sort((a, b) => Number(b.esPortada) - Number(a.esPortada) || (a.orden || 0) - (b.orden || 0));
  const imageUrls = [backend.portadaUrl, ...evidences.map(e => e.urlArchivo)].filter(Boolean) as string[];
  const learningItems = (backend.aprendizajes || []).sort((a, b) => (a.orden || 0) - (b.orden || 0));
  const materialItems = (backend.materiales || []).sort((a, b) => (a.id || 0) - (b.id || 0));

  return {
    id: String(backend.id),
    backendId: backend.id,
    slug: backend.slug,
    categoriaId: backend.categoria?.id,
    title: backend.nombre,
    category,
    categoryLabel: backend.categoria?.nombre || defaultCategoryLabel(category),
    tag: backend.metodologia || backend.tipo || defaultCategoryLabel(category),
    description: backend.descripcion || backend.resumen || 'Actividad registrada en el portafolio de Didáctica.',
    objective: backend.objetivoDidactico || 'Fortalecer el proceso de enseñanza y aprendizaje mediante una estrategia didáctica.',
    materials: materialItems.map(m => [m.nombre, m.cantidad].filter(Boolean).join(' - ')),
    materialItems,
    targetGroup: backend.publicoObjetivo || 'Estudiantes en general',
    learnings: learningItems.length ? learningItems.map(l => l.descripcion) : ['Aprendizaje pendiente por registrar.'],
    learningItems,
    reflection: backend.reflexionFinal || 'Reflexión final pendiente por registrar.',
    evidenceImages: imageUrls.length ? imageUrls : [DEFAULT_IMAGE],
    evidenceItems: evidences.map(e => ({
      id: e.id,
      titulo: e.titulo,
      descripcion: e.descripcion,
      tipo: e.tipo,
      urlArchivo: e.urlArchivo!,
      nombreArchivo: e.nombreArchivo,
      mimeType: e.mimeType,
      pesoBytes: e.pesoBytes,
      orden: e.orden,
      esPortada: e.esPortada,
    })),
    difficulty: 'Medio',
    preparationTime: backend.fechaRealizacion ? `Realizada: ${backend.fechaRealizacion}` : '30 mins',
    pedagogicalParadigm: backend.metodologia || 'Didáctica activa',
    estado: backend.estado,
    tipo: backend.tipo,
    destacado: backend.destacado,
    orden: backend.orden,
    fechaRealizacion: backend.fechaRealizacion,
    lugar: backend.lugar,
  };
}

function toActividadRequest(form: ActivityFormData, categories: Category[]) {
  const category = categories.find(c => c.id === form.categoriaId)
    || categories.find(c => c.uiCategory === form.category)
    || categories[0];

  if (!category?.id) {
    throw new Error('No hay categorías disponibles en el backend. Cree o cargue categorías antes de guardar actividades.');
  }

  return {
    categoriaId: category.id,
    nombre: form.title,
    tipo: form.category === 'proyectos' ? 'PROYECTO' : 'ACTIVIDAD',
    estado: form.estado || 'PUBLICADO',
    resumen: form.description.slice(0, 280),
    descripcion: form.description,
    objetivoDidactico: form.objective,
    metodologia: form.pedagogicalParadigm || form.tag,
    publicoObjetivo: form.targetGroup,
    lugar: form.lugar,
    fechaRealizacion: form.fechaRealizacion || null,
    portadaUrl: form.evidenceItems[0]?.urlArchivo || form.newEvidenceUrls[0] || undefined,
    reflexionFinal: form.reflection,
    destacado: form.destacado,
    orden: form.orden || 0,
  };
}

export const didacticaApi = {
  baseUrl: API_BASE_URL,

  async login(correo: string, password: string): Promise<AuthUser> {
    const response = await request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, password }),
    });
    return saveAuth(response);
  },

  async getPublicPortafolio(): Promise<PortafolioInfo> {
    return request<PortafolioInfo>('/api/public/portafolio');
  },

  async getPublicCategorias(): Promise<Category[]> {
    const data = await request<BackendCategoria[]>('/api/public/categorias');
    return data.map(mapCategory);
  },

  async getPublicActividades(): Promise<Activity[]> {
    const data = await request<BackendActividad[]>('/api/public/actividades');
    return data.map(mapActivity);
  },

  async getPublicDestacadas(): Promise<Activity[]> {
    const data = await request<BackendActividad[]>('/api/public/actividades/destacadas');
    return data.map(mapActivity);
  },

  async getPublicActividadBySlug(slug: string): Promise<Activity> {
    const data = await request<BackendActividad>(`/api/public/actividades/${encodeURIComponent(slug)}`);
    return mapActivity(data);
  },

  async getAdminActividades(): Promise<Activity[]> {
    const data = await request<BackendActividad[]>('/api/admin/actividades', {}, true);
    return data.map(mapActivity);
  },

  async getAdminActividad(id: number): Promise<Activity> {
    const data = await request<BackendActividad>(`/api/admin/actividades/${id}`, {}, true);
    return mapActivity(data);
  },

  async createActividad(form: ActivityFormData, categories: Category[]): Promise<Activity> {
    const data = await request<BackendActividad>('/api/admin/actividades', {
      method: 'POST',
      body: JSON.stringify(toActividadRequest(form, categories)),
    }, true);
    return mapActivity(data);
  },

  async updateActividad(id: number, form: ActivityFormData, categories: Category[]): Promise<Activity> {
    const data = await request<BackendActividad>(`/api/admin/actividades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toActividadRequest(form, categories)),
    }, true);
    return mapActivity(data);
  },

  async deleteActividad(id: number): Promise<void> {
    await request<void>(`/api/admin/actividades/${id}`, { method: 'DELETE' }, true);
  },

  async publicarActividad(id: number): Promise<Activity> {
    const data = await request<BackendActividad>(`/api/admin/actividades/${id}/publicar`, { method: 'PATCH' }, true);
    return mapActivity(data);
  },

  async archivarActividad(id: number): Promise<Activity> {
    const data = await request<BackendActividad>(`/api/admin/actividades/${id}/archivar`, { method: 'PATCH' }, true);
    return mapActivity(data);
  },

  async borradorActividad(id: number): Promise<Activity> {
    const data = await request<BackendActividad>(`/api/admin/actividades/${id}/borrador`, { method: 'PATCH' }, true);
    return mapActivity(data);
  },

  async createAprendizaje(actividadId: number, learning: LearningItem): Promise<LearningItem> {
    return request<LearningItem>(`/api/admin/actividades/${actividadId}/aprendizajes`, {
      method: 'POST',
      body: JSON.stringify({ descripcion: learning.descripcion, orden: learning.orden || 0 }),
    }, true);
  },

  async updateAprendizaje(learning: LearningItem): Promise<LearningItem> {
    return request<LearningItem>(`/api/admin/aprendizajes/${learning.id}`, {
      method: 'PUT',
      body: JSON.stringify({ descripcion: learning.descripcion, orden: learning.orden || 0 }),
    }, true);
  },

  async deleteAprendizaje(id: number): Promise<void> {
    await request<void>(`/api/admin/aprendizajes/${id}`, { method: 'DELETE' }, true);
  },

  async createMaterial(actividadId: number, material: MaterialItem): Promise<MaterialItem> {
    return request<MaterialItem>(`/api/admin/actividades/${actividadId}/materiales`, {
      method: 'POST',
      body: JSON.stringify(material),
    }, true);
  },

  async updateMaterial(material: MaterialItem): Promise<MaterialItem> {
    return request<MaterialItem>(`/api/admin/materiales/${material.id}`, {
      method: 'PUT',
      body: JSON.stringify(material),
    }, true);
  },

  async deleteMaterial(id: number): Promise<void> {
    await request<void>(`/api/admin/materiales/${id}`, { method: 'DELETE' }, true);
  },

  async createEvidenceFromUrl(actividadId: number, url: string, order: number, esPortada = false): Promise<EvidenceItem> {
    return request<EvidenceItem>(`/api/admin/actividades/${actividadId}/evidencias`, {
      method: 'POST',
      body: JSON.stringify({
        titulo: `Evidencia ${order + 1}`,
        descripcion: 'Evidencia asociada a la actividad.',
        tipo: 'IMAGEN',
        urlArchivo: url,
        orden: order,
        esPortada,
      }),
    }, true);
  },

  async uploadEvidenceFile(actividadId: number, file: File, order: number, esPortada = false): Promise<EvidenceItem> {
    const form = new FormData();
    form.append('titulo', file.name || `Evidencia ${order + 1}`);
    form.append('descripcion', 'Evidencia cargada desde el panel administrativo.');
    form.append('tipo', 'IMAGEN');
    form.append('orden', String(order));
    form.append('esPortada', String(esPortada));
    form.append('archivo', file);

    return request<EvidenceItem>(`/api/admin/actividades/${actividadId}/evidencias`, {
      method: 'POST',
      body: form,
    }, true);
  },

  async deleteEvidencia(id: number): Promise<void> {
    await request<void>(`/api/admin/evidencias/${id}`, { method: 'DELETE' }, true);
  },
};
