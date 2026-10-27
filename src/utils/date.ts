export function formatDeadlinePtBr(dateStr: string): string {
  if (!dateStr) return 'Sem prazo';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

export function getDeadlineInfo(dateStr: string, status: string): {
  daysRemaining: number;
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  isUrgent: boolean;
} {
  if (!dateStr) {
    return { daysRemaining: 999, label: 'Sem prazo', isOverdue: false, isToday: false, isUrgent: false };
  }

  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (status === 'concluido') {
    return {
      daysRemaining: diffDays,
      label: 'Concluído',
      isOverdue: false,
      isToday: false,
      isUrgent: false
    };
  }

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      daysRemaining: diffDays,
      label: `Atrasado há ${overdueDays} ${overdueDays === 1 ? 'dia' : 'dias'}`,
      isOverdue: true,
      isToday: false,
      isUrgent: true
    };
  }

  if (diffDays === 0) {
    return {
      daysRemaining: 0,
      label: 'Vence hoje!',
      isOverdue: false,
      isToday: true,
      isUrgent: true
    };
  }

  if (diffDays === 1) {
    return {
      daysRemaining: 1,
      label: 'Vence amanhã',
      isOverdue: false,
      isToday: false,
      isUrgent: true
    };
  }

  return {
    daysRemaining: diffDays,
    label: `${diffDays} dias restantes`,
    isOverdue: false,
    isToday: false,
    isUrgent: diffDays <= 3
  };
}
