import { Alert } from '../../components/Alert'
import { withPageAuth } from '@supabase/auth-helpers-nextjs'
import { BuyerHome } from 'components/buyer/BuyerHome'

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
