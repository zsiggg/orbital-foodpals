import { DelivererHome } from '../components/DelivererHome'
import { Alert } from '../components/Alert'
import { withPageAuth } from '@supabase/auth-helpers-nextjs'

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
