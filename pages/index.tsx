import { OnBoarding } from '../components/Onboarding'
import Head from 'next/head'

const Root = () => {
  return (
    <div>
      <Head>
        <title>Foodpals</title>
        <meta name="keywords" content="food delivery, orbital" />
      </Head>

      <OnBoarding />
    </div>
  )
}

export default Root
