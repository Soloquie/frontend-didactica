export type ActivityCategory =
  | 'juegos'
  | 'dinamicas'
  | 'aula'
  | 'proyectos'
  | 'evidencias'
  | 'reflexiones'
  | 'otros';

export type ActivityStatus = 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';
export type ActivityType = 'ACTIVIDAD' | 'PROYECTO';

export interface Category {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  orden?: number;
  activo?: boolean;
  uiCategory: ActivityCategory;
}

export interface EvidenceItem {
  id?: number;
  titulo?: string;
  descripcion?: string;
  tipo?: 'IMAGEN' | 'VIDEO' | 'DOCUMENTO';
  urlArchivo: string;
  nombreArchivo?: string;
  mimeType?: string;
  pesoBytes?: number;
  orden?: number;
  esPortada?: boolean;
}

export interface LearningItem {
  id?: number;
  descripcion: string;
  orden?: number;
}

export interface MaterialItem {
  id?: number;
  nombre: string;
  cantidad?: string;
  descripcion?: string;
}

export interface Activity {
  id: string;
  backendId?: number;
  slug?: string;
  categoriaId?: number;
  title: string;
  category: ActivityCategory;
  categoryLabel: string;
  tag: string;
  description: string;
  objective: string;
  materials?: string[];
  materialItems?: MaterialItem[];
  targetGroup?: string;
  learnings: string[];
  learningItems?: LearningItem[];
  reflection: string;
  evidenceImages: string[];
  evidenceItems?: EvidenceItem[];
  difficulty: 'Fácil' | 'Medio' | 'Avanzado';
  preparationTime: string;
  pedagogicalParadigm: string;
  estado?: ActivityStatus;
  tipo?: ActivityType;
  destacado?: boolean;
  orden?: number;
  fechaRealizacion?: string;
  lugar?: string;
}

export interface ActivityFormData {
  backendId?: number;
  title: string;
  category: ActivityCategory;
  categoriaId?: number;
  tag: string;
  description: string;
  objective: string;
  materials: MaterialItem[];
  targetGroup?: string;
  learnings: LearningItem[];
  reflection: string;
  evidenceItems: EvidenceItem[];
  newEvidenceFiles: File[];
  newEvidenceUrls: string[];
  difficulty: 'Fácil' | 'Medio' | 'Avanzado';
  preparationTime: string;
  pedagogicalParadigm: string;
  estado: ActivityStatus;
  destacado: boolean;
  orden?: number;
  fechaRealizacion?: string;
  lugar?: string;
}

export interface Metric {
  label: string;
  value: string | number;
  icon: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface PortafolioInfo {
  id?: number;
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  materia?: string;
  docente?: string;
  institucion?: string;
  periodoAcademico?: string;
  imagenPortadaUrl?: string;
  colorPrincipal?: string;
  colorSecundario?: string;
  activo?: boolean;
}

export interface GroupInfo {
  id?: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  integrantes: string[];
  activo?: boolean;
}

export interface AuthUser {
  token: string;
  tipo: string;
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'EDITOR';
}
