import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  /* ไฟล์นี้ไม่มีอะไรมากแค่ ทำการเอา bootstrap กับ google font มาใช้ตาม document ของ nextjs */
  return (
    <Html>
      <Head>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Itim&family=Kanit&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}