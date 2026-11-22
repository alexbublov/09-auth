import axios from 'axios';
import type { Note } from '../types/note';

export interface FetchNotesParams {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
  sortBy?: 'created' | 'updated';
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const ServerApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const res = await ServerApi.get<FetchNotesResponse>('/notes', {
    params,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const res = await ServerApi.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};

export interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (body: NewNoteData) => {
  const res = await ServerApi.post<Note>('/notes', body, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await ServerApi.delete<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};
