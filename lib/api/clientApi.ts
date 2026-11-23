import type { User } from '@/types/user';
import type { Note } from '@/types/note';
import { api } from './api';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateMeRequest {
  username: string;
}

export const register = async (body: RegisterRequest): Promise<User> => {
  const res = await api.post<User>('/auth/register', body);
  return res.data;
};

export const login = async (body: LoginRequest): Promise<User> => {
  const res = await api.post<User>('/auth/login', body);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<{ success: boolean }> => {
  const res = await api.get<{ success: boolean }>('/auth/session');
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>('/users/me');
  return res.data;
};

export const updateMe = async (body: UpdateMeRequest): Promise<User> => {
  const res = await api.patch<User>('/users/me', body);
  return res.data;
};

export interface FetchNotesParams {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const res = await api.get<FetchNotesResponse>('/notes', { params });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (body: NewNoteData): Promise<Note> => {
  const res = await api.post<Note>('/notes', body);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};
