import { handleAuth } from '@supabase/auth-helpers-nextjs';

export default handleAuth({ logout: { returnTo: '/' } });

// for pages to be protected by auth,
    // const {user, error} = useUser()
    // if (user) { <supabase api calls> }

    // export const getServerSideProps = withPageAuth({ redirectTo: '/login' });
    // now user is stored as props.user

// api/auth/user -> get user in JSON format
// api/auth/logout -> logout