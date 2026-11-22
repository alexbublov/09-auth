import { QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async ({
  params,
}: NotesProps): Promise<Metadata> => {
  const { slug } = await params;
  const tagName = slug[0] === 'all' ? 'All Tags' : slug[0];

  const metadata: Metadata = {
    title: `Notes - ${tagName}`,
    description: `Browse notes with ${slug[0]} tag. NoteHub allows you to filter and view notes based on specific tags for better organization.`,
    openGraph: {
      title: `Notes - ${tagName}`,
      description: `Browse notes with ${slug[0]} tag. NoteHub allows you to filter and view notes based on specific tags for better organization.`,
      url: `https://notehub.com/notes/filter/${slug[0]}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes - ${tagName} | NoteHub`,
        },
      ],
      type: 'website',
    },
  };
  return metadata;
};

const Notes = async ({ params }: NotesProps) => {
  const queryClient = new QueryClient();
  const { slug } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['notes', { value: '', page: 1, perPage: 12, slug }],
    queryFn: () =>
      fetchNotes({
        search: '',
        page: 1,
        perPage: 12,
        tag: slug[0] === 'all' ? undefined : slug[0],
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient slug={slug} />
    </HydrationBoundary>
  );
};

export default Notes;
