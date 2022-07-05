import { Alert } from '../../components/Alert'
import { withPageAuth } from '@supabase/auth-helpers-nextjs'
import { DelivererHome } from 'components/deliverer/DelivererHome'

const delivererHome = () => {
  return (
    <>
      <Alert />
      <DelivererHome />
    </>
  )
}

export default delivererHome
export const getServerSideProps = withPageAuth({ redirectTo: '/login' })
