export type BadgeCategory = 'inicio' | 'consistencia' | 'organizacao';

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: 'flag' | 'target' | 'check' | 'trophy' | 'flame' | 'layers' | 'clock';
  category: BadgeCategory;
  unlockedAt: string | null; // ISO string if unlocked, or null
  progress: {
    current: number;
    target: number;
    label: string;
  };
}

export interface UnlockedAlert {
  badge: Badge;
  timestamp: number;
}
