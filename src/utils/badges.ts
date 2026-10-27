import { StudyObjective } from '../types/objective';
import { Badge } from '../types/badge';

const BADGES_STORAGE_KEY = 'studyflow_unlocked_badges_v1';

export function getUnlockedTimestamps(): Record<string, string> {
  try {
    const raw = localStorage.getItem(BADGES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Erro ao ler conquistas do localStorage:', err);
  }
  return {};
}

export function saveUnlockedTimestamp(badgeId: string): void {
  try {
    const existing = getUnlockedTimestamps();
    if (!existing[badgeId]) {
      existing[badgeId] = new Date().toISOString();
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (err) {
    console.error('Erro ao salvar conquista no localStorage:', err);
  }
}

export function evaluateBadges(objectives: StudyObjective[]): {
  badges: Badge[];
  newlyUnlocked: Badge[];
} {
  const unlockedMap = getUnlockedTimestamps();
  const newlyUnlocked: Badge[] = [];

  const totalCreated = objectives.length;
  const totalCompleted = objectives.filter(o => o.status === 'concluido').length;
  const hasInProgress = objectives.some(o => o.status === 'em_andamento');
  
  const hasCompletedSubtasksGroup = objectives.some(
    o => o.subtasks && o.subtasks.length > 0 && o.subtasks.every(s => s.completed)
  );

  const hasOnTimeCompleted = objectives.some(o => {
    if (o.status !== 'concluido' || !o.deadline) return false;
    const [y, m, d] = o.deadline.split('-').map(Number);
    const deadlineDate = new Date(y, m - 1, d, 23, 59, 59);
    const completionDate = new Date(o.updatedAt);
    return completionDate <= deadlineDate;
  });

  const definitions: Array<{
    id: string;
    title: string;
    description: string;
    iconName: Badge['iconName'];
    category: Badge['category'];
    condition: boolean;
    currentProgress: number;
    targetProgress: number;
    progressLabel: string;
  }> = [
    {
      id: 'first_objective',
      title: 'Primeiro Objetivo Criado',
      description: 'Cadastrou o seu primeiro objetivo de estudos no StudyFlow.',
      iconName: 'flag',
      category: 'inicio',
      condition: totalCreated >= 1,
      currentProgress: Math.min(totalCreated, 1),
      targetProgress: 1,
      progressLabel: `${Math.min(totalCreated, 1)}/1 objetivo criado`
    },
    {
      id: 'first_in_progress',
      title: 'Modo Estudo Ativo',
      description: 'Iniciou a jornada colocando um objetivo "Em andamento".',
      iconName: 'target',
      category: 'inicio',
      condition: hasInProgress || totalCompleted >= 1,
      currentProgress: hasInProgress || totalCompleted >= 1 ? 1 : 0,
      targetProgress: 1,
      progressLabel: hasInProgress || totalCompleted >= 1 ? '1/1 em andamento' : '0/1 em andamento'
    },
    {
      id: 'first_completed',
      title: 'Primeira Vitória',
      description: 'Concluiu com sucesso o seu primeiro objetivo de estudo.',
      iconName: 'check',
      category: 'consistencia',
      condition: totalCompleted >= 1,
      currentProgress: Math.min(totalCompleted, 1),
      targetProgress: 1,
      progressLabel: `${Math.min(totalCompleted, 1)}/1 objetivo concluído`
    },
    {
      id: 'three_completed',
      title: 'No Ritmo dos Estudos',
      description: 'Completou 3 objetivos e está consolidando o hábito de aprender.',
      iconName: 'layers',
      category: 'consistencia',
      condition: totalCompleted >= 3,
      currentProgress: Math.min(totalCompleted, 3),
      targetProgress: 3,
      progressLabel: `${Math.min(totalCompleted, 3)}/3 objetivos concluídos`
    },
    {
      id: 'five_completed',
      title: 'Mestre da Consistência',
      description: 'Atingiu a marca de 5 objetivos concluídos! Foco de alto nível.',
      iconName: 'trophy',
      category: 'consistencia',
      condition: totalCompleted >= 5,
      currentProgress: Math.min(totalCompleted, 5),
      targetProgress: 5,
      progressLabel: `${Math.min(totalCompleted, 5)}/5 objetivos concluídos`
    },
    {
      id: 'five_created',
      title: 'Estrategista de Estudos',
      description: 'Planejou 5 ou mais objetivos no seu painel de aprendizado.',
      iconName: 'flame',
      category: 'organizacao',
      condition: totalCreated >= 5,
      currentProgress: Math.min(totalCreated, 5),
      targetProgress: 5,
      progressLabel: `${Math.min(totalCreated, 5)}/5 objetivos criados`
    },
    {
      id: 'all_subtasks_done',
      title: 'Fatiador de Metas',
      description: 'Concluiu todas as micro-etapas de um objetivo de estudos.',
      iconName: 'check',
      category: 'organizacao',
      condition: hasCompletedSubtasksGroup,
      currentProgress: hasCompletedSubtasksGroup ? 1 : 0,
      targetProgress: 1,
      progressLabel: hasCompletedSubtasksGroup ? 'Etapas cumpridas!' : '0/1 lista finalizada'
    },
    {
      id: 'on_time_completion',
      title: 'Pontualidade Máxima',
      description: 'Concluiu um objetivo rigorosamente dentro do prazo estipulado.',
      iconName: 'clock',
      category: 'consistencia',
      condition: hasOnTimeCompleted,
      currentProgress: hasOnTimeCompleted ? 1 : 0,
      targetProgress: 1,
      progressLabel: hasOnTimeCompleted ? 'No prazo!' : '0/1 meta no prazo'
    }
  ];

  const badges: Badge[] = definitions.map(def => {
    const wasAlreadyUnlocked = Boolean(unlockedMap[def.id]);
    let unlockedAt = unlockedMap[def.id] || null;

    if (def.condition && !wasAlreadyUnlocked) {
      unlockedAt = new Date().toISOString();
      saveUnlockedTimestamp(def.id);
      newlyUnlocked.push({
        id: def.id,
        title: def.title,
        description: def.description,
        iconName: def.iconName,
        category: def.category,
        unlockedAt,
        progress: {
          current: def.currentProgress,
          target: def.targetProgress,
          label: def.progressLabel
        }
      });
    }

    return {
      id: def.id,
      title: def.title,
      description: def.description,
      iconName: def.iconName,
      category: def.category,
      unlockedAt: wasAlreadyUnlocked ? unlockedAt : (def.condition ? unlockedAt : null),
      progress: {
        current: def.currentProgress,
        target: def.targetProgress,
        label: def.progressLabel
      }
    };
  });

  return { badges, newlyUnlocked };
}
