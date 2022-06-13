import '../styles/globals.css'
import AlertContext from '../helpers/alertContext'
import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

function MyApp({ Component, pageProps }) {
  return (
    <AlertContext>
      <UserProvider supabaseClient={supabaseClient}>
        <Component {...pageProps}/>
      </UserProvider>
    </AlertContext>
  )
}

export default MyApp
