'use client';

import { createNote, type NewNoteData } from '@/lib/api/clientApi';
import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import useNoteDraftStore from '@/lib/store/noteStore';

const NoteForm = () => {
  const router = useRouter();
  const draft = useNoteDraftStore(state => state.draft);
  const setDraft = useNoteDraftStore(state => state.setDraft);
  const clearDraft = useNoteDraftStore(state => state.clearDraft);
  const updateDraft = (field: 'title' | 'content' | 'tag', value: string) => {
    setDraft({ ...useNoteDraftStore.getState().draft, [field]: value });
  };

  const queryClient = useQueryClient();
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
  });

  const formAction = async (formData: FormData) => {
    const title = formData.get('title');
    const content = formData.get('content');
    const tag = formData.get('tag');

    if (
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      typeof tag !== 'string'
    ) {
      return;
    }

    const inputs: NewNoteData = { title, content, tag };

    try {
      await createNoteMutation.mutateAsync(inputs);
    } catch {
      return;
    }
  };

  return (
    <form className={css.form}>
      {createNoteMutation.isError && (
        <p className={css.error} role="alert">
          Could not create note: {createNoteMutation.error.message}
        </p>
      )}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          minLength={3}
          maxLength={50}
          required
          onChange={event => updateDraft('title', event.target.value)}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          maxLength={500}
          onChange={event => updateDraft('content', event.target.value)}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          required
          onChange={event => updateDraft('tag', event.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          formAction={formAction}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
