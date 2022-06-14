import { withPageAuth } from '@supabase/auth-helpers-nextjs'
import { Alert } from '../components/Alert'

const welcome = () => {
  return (
    <>
      <Alert />
      <div className="flex justify-center">
        <div className="text-xl font-bold">Welcome to Foodpals!</div>
      </div>
    </>
  )
}

export const getServerSideProps = withPageAuth({ redirectTo: '/login' })
export default welcome
