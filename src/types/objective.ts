export type ObjectiveStatus = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'pausado';

export type Priority = 'baixa' | 'media' | 'alta';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string YYYY-MM-DD
  status: ObjectiveStatus;
  category?: string; // e.g. "Matemática", "Inglês", "Programação", "Geral"
  priority?: Priority;
  subtasks?: Subtask[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type ViewMode = 'cards' | 'kanban' | 'compact';

export type SortOption = 'deadline_asc' | 'deadline_desc' | 'created_desc' | 'title_asc';
