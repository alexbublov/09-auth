'use client';

import { useParams, useRouter } from 'next/navigation';
import css from './NotePreview.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import BackButton from '@/components/BackButton/BackButton';

const NotePreviewClient = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const noteQuery = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const note = noteQuery.data;

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <>
        {noteQuery.isLoading && <p>Loading, please wait...</p>}

        {(noteQuery.isError || !note) && <p>Something went wrong.</p>}

        {note && (
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
        )}
      </>
    </Modal>
  );
};

export default NotePreviewClient;
