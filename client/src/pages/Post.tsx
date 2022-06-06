import { useParams } from 'react-router-dom';
import { usePost } from '../hooks/usePost';

export default function Post() {
  const { id } = useParams();
  const { data: post } = usePost(id!);
  return <pre>{JSON.stringify(post, null, 2)}</pre>;
}
