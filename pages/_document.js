import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const meta = {
    title: 'Mr Sharafdin',
    description: 'Dedicated Software Engineer at Sharafdin with a passion for science and technology. Avid learner, skilled in data science and machine learning, striving to advance decision-making through innovative algorithms. Prolific writer sharing insights and experiences on Culuumta.',
    image: 'https://raw.githubusercontent.com/isasharafdin/Portfolio/main/public/images/Malcolm-X-Profile-Photo.jpg'
  }

  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@isasharafdin" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        <meta name="google-site-verification" content="at2xv7-NdwIQKD_DXL2eiTl1rMgW-eYEhZqGCwguAp4" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
