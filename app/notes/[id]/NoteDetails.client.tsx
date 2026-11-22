'use client';

import { useParams } from 'next/navigation';
import css from './NoteDetails.module.css';
import { fetchNoteById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import BackButton from '@/components/BackButton/BackButton';

const NoteDetails = () => {
  const { id } = useParams<{ id: string }>();
  const noteQuery = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const note = noteQuery.data;

  return (
    <>
      {noteQuery.isLoading && <p>Loading, please wait...</p>}

      {(noteQuery.isError || !note) && <p>Something went wrong.</p>}

      {note && (
        <main className={css.main}>
          <div className={css.container}>
            <BackButton />
            <div className={css.item}>
              <div className={css.header}>
                <h2>{note.title}</h2>
              </div>
              <p className={css.tag}>{note.tag}</p>
              <p className={css.content}>{note.content}</p>
              <p className={css.date}>{note.createdAt}</p>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default NoteDetails;
