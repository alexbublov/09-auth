import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';
import { fetchNoteById } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';
interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: NoteDetailsProps): Promise<Metadata> => {
  const { id } = await params;
  const details = await fetchNoteById(id);

  const metadata: Metadata = {
    title: details.title,
    description: details.content,
    openGraph: {
      title: details.title,
      description: details.content,
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: details.title,
        },
      ],
      type: 'website',
    },
  };
  return metadata;
};

const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const queryClient = new QueryClient();
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;
