import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getToken } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getToken() ? '/documents' : '/login');
  }, [router]);

  return null;
}
