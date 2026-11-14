'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton({ className }: { className: string }) {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSignOut() {
    setError('');
    try {
      const { error: signOutError } = await createClient().auth.signOut();
      if (signOutError) throw signOutError;
    } catch {
      setError('Unable to sign out. Please try again.');
      return;
    }

    router.replace('/');
    router.refresh();
  }

  return (
    <div>
      <button type="button" onClick={handleSignOut} className={className}>
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
      {error ? <p role="alert" className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
