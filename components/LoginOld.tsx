import { Logo } from "./Logo";
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { Auth } from "@supabase/ui";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
//
export const LoginOld = () => {
  const router = useRouter()
  const { user, error } = useUser()
  if (user) {
    router.push('/welcome')
  }
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white max-w-md w-full space-y-8 rounded-lg shadow-lg p-10">
        <Logo />
        <Auth supabaseClient={supabaseClient} className="relative -top-5"/>
      </div>
    </div>
  );
};
