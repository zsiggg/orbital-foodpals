import { BuyerHome } from '../../components/BuyerHome'
import { Alert } from '../../components/Alert'
import { withPageAuth } from '@supabase/auth-helpers-nextjs'

const buyerHome = () => {
  return (
    <>
      <Alert />
      <BuyerHome />
    </>
  )
}

export default buyerHome
export const getServerSideProps = withPageAuth({ redirectTo: '/login' })
