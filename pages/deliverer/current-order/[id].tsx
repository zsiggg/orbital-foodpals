import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { CurrentOrderMap } from "components/CurrentOrderMap";

const CurrentOrder = ({ user }) => {
    return (
        <div className="h-screen">
            <CurrentOrderMap location={[103.77716348378665, 1.2975835816469965]} />
        </div>
    )
}

export const getServerSideProps = withPageAuth({ redirectTo: '/login' })
export default CurrentOrder;