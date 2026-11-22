import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NewNoteData } from '../api';

const initialDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteDraftStore {
  draft: NewNoteData;
  setDraft: (note: NewNoteData) => void;
  clearDraft: () => void;
}

const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    setStore => {
      return {
        draft: initialDraft,

        setDraft: note => {
          setStore(() => {
            return { draft: note };
          });
        },

        clearDraft: () => {
          setStore(() => {
            return { draft: initialDraft };
          });
        },
      };
    },
    {
      name: 'noteDraft',
      partialize: state => ({ draft: state.draft }),
    }
  )
);

export default useNoteDraftStore;
