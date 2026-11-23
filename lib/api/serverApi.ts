import { cookies } from 'next/headers';
import type { User } from '@/types/user';
import { api } from './api';

export interface FetchNotesParams {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
}

export const fetchNotes = async (params: FetchNotesParams = {}) => {
  const cookieStore = await cookies();
  const res = await api.get('/notes', {
    params,
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const cookieStore = await cookies();
  const res = await api.get(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const res = await api.get<User>('/users/me', {
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};

export const checkSession = async (): Promise<{ success: boolean }> => {
  const cookieStore = await cookies();
  const res = await api.get<{ success: boolean }>('/auth/session', {
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};
