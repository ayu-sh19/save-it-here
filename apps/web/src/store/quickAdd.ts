import { create } from 'zustand';

export type QuickAddTab = 'idea' | 'transaction' | 'wishlist' | 'account' | 'category' | 'lending' | 'investment' | 'goal';

interface QuickAddStore {
  isOpen: boolean;
  activeTab: QuickAddTab;
  prefillData: Record<string, any>;
  openQuickAdd: (tab?: QuickAddTab, data?: Record<string, any>) => void;
  closeQuickAdd: () => void;
  setActiveTab: (tab: QuickAddTab) => void;
  toggleQuickAdd: () => void;
}

export const useQuickAddStore = create<QuickAddStore>((set) => ({
  isOpen: false,
  activeTab: 'idea',
  prefillData: {},
  openQuickAdd: (tab = 'idea', data = {}) => set({ isOpen: true, activeTab: tab, prefillData: data }),
  closeQuickAdd: () => set({ isOpen: false, prefillData: {} }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleQuickAdd: () => set((state) => ({ isOpen: !state.isOpen })),
}));
