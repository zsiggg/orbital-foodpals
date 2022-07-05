import { withPageAuth } from '@supabase/auth-helpers-nextjs'
import { CurrentOrderMap } from 'components/CurrentOrderMap'
import { OrderOverlay } from 'components/deliverer/OrderOverlay'

const CurrentOrder = ({ user }) => {
  return (
    <div className="flex">
      <div className="h-screen flex-1">
        <CurrentOrderMap location={[103.77716348378665, 1.2975835816469965]} />
      </div>
      <div className="w-1/3">
        <OrderOverlay />
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuth({ redirectTo: '/login' })
export default CurrentOrder
