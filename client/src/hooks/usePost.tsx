import useSWR from 'swr';
import { Error } from '../types/Error';
import { Post } from '../types/Post';

export function usePost(id: number | string) {
  return useSWR<Post, Error>(`/post/${id}`);
}
