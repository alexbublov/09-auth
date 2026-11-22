'use client';

import { useState } from 'react';
import NoteList from '@/components/NoteList/NoteList';
import css from './notes.module.css';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';

interface NotesClientProps {
  slug: string[];
}

const NotesClient = ({ slug }: NotesClientProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 12;

  const [value] = useDebounce(search, 500);
  const notesQuery = useQuery({
    queryKey: ['notes', { value, page, perPage, slug }],
    queryFn: () =>
      fetchNotes({
        search: value,
        page,
        perPage,
        tag: slug[0] === 'all' ? undefined : slug[0],
      }),
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
  const notes = notesQuery.data?.notes ?? [];

  const totalPages = notesQuery.data?.totalPages ?? 1;

  const handleSearchChange = (nextSearch: string) => {
    setSearch(nextSearch);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox search={search} setSearch={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
};

export default NotesClient;
