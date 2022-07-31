import Head from 'next/head'
import Script from 'next/script'
import '../styles/global.css'


function MyApp({ Component, pageProps }) {
  /* ไฟล์หลักของ app nextjs  */
  return (
    <>
      <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Barin Website</title>
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossOrigin="anonymous"></Script>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
