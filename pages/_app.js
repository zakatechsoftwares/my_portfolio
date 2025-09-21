// pages/_app.js
import '../styles/globals.css' // preserve your global styles import if present
import { SessionProvider } from 'next-auth/react'

export default function MyApp({ Component, pageProps }) {
  // pageProps may include session if you returned it from getServerSideProps
  const { session, ...rest } = pageProps

  return (
    <SessionProvider session={session}>
      <Component {...rest} />
    </SessionProvider>
  )
}
