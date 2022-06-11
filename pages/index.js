import { Home } from '../components/Home'
import Head from 'next/head'

const root = () => {
  return (
    <div>
      <Head>
        <title>Foodpals</title>
        <meta name="keywords" content="food delivery, orbital" />
      </Head>

      <Home />
    </div>
  )
}

export default root
