import { StudyObjective } from '../types/objective';
import { INITIAL_OBJECTIVES } from './initialData';

const STORAGE_KEY = 'studyflow_objectives_v1';

export function loadObjectives(): StudyObjective[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit: save initial beginner objectives and return them
      saveObjectives(INITIAL_OBJECTIVES);
      return INITIAL_OBJECTIVES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_OBJECTIVES;
  } catch (err) {
    console.error('Erro ao carregar objetivos do localStorage:', err);
    return INITIAL_OBJECTIVES;
  }
}

export function saveObjectives(objectives: StudyObjective[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
  } catch (err) {
    console.error('Erro ao salvar objetivos no localStorage:', err);
  }
}

export function resetToSampleObjectives(): StudyObjective[] {
  saveObjectives(INITIAL_OBJECTIVES);
  return INITIAL_OBJECTIVES;
}

export function clearAllObjectives(): StudyObjective[] {
  const empty: StudyObjective[] = [];
  saveObjectives(empty);
  return empty;
}
