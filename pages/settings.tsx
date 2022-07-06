import { withPageAuth } from "@supabase/auth-helpers-nextjs"

const settings = ({ user }) => {
    return (
        <p>Settings page for {user.id}</p>
    )
}

export default settings
export const getServerSideProps = withPageAuth({ redirectTo: '/login' })