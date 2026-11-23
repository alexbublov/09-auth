'use client';

import type { Note } from '@/types/note';
import { deleteNote } from '@/lib/api/clientApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteList.module.css';
import Link from 'next/link';

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <>
      {deleteNoteMutation.isError && (
        <p className={css.error} role="alert">
          Could not delete note: {deleteNoteMutation.error.message}
        </p>
      )}
      <ul className={css.list}>
        {notes.map(note => {
          return (
            <li key={note.id} className={css.listItem}>
              <h2 className={css.title}>{note.title}</h2>
              <p className={css.content}>{note.content}</p>
              <div className={css.footer}>
                <span className={css.tag}>{note.tag}</span>

                <Link href={`/notes/${note.id}`} className={css.link}>
                  Details
                </Link>

                <button
                  className={css.button}
                  onClick={() => deleteNoteMutation.mutate(note.id)}
                  disabled={deleteNoteMutation.isPending}
                >
                  {deleteNoteMutation.isPending &&
                  deleteNoteMutation.variables === note.id
                    ? 'Deleting...'
                    : 'Delete'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default NoteList;
