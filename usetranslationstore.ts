const createTranslationStore = (initialState: TranslationState) => {
  return create<TranslationStore>((set) => ({
    ...initialState,
    setLanguages: (languages) => set({ languages }),
    setCurrentLanguage: (currentLanguage) => set({ currentLanguage }),
    setTranslations: (translations) => set({ translations }),
    initialize: () => set({ initialized: true }),
  }));
};

const initialTranslationState: TranslationState = {
  languages: [],
  currentLanguage: 'en',
  translations: {},
  initialized: false
};

export const useTranslationStore = createTranslationStore(initialTranslationState);