import { Nunito, Amatic_SC } from 'next/font/google'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.css'

const nunito = Nunito({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'block',
})

const amaticSC = Amatic_SC({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-amatic',
  display: 'block',
})

const pallyRegular = localFont({
  src: '../public/fonts/Pally-Regular.woff2',
  variable: '--font-pally-regular',
  weight: '400',
  display: 'swap',
})

const pallyMedium = localFont({
  src: '../public/fonts/Pally-Medium.woff2',
  variable: '--font-pally-medium',
  weight: '500',
  display: 'swap',
})

const pallyBold = localFont({
  src: '../public/fonts/Pally-Bold.woff2',
  variable: '--font-pally-bold',
  weight: '700',
  display: 'swap',
})

export const metadata = {
  title: "Bruno's",
  description: "Bruno Simon's creative portfolio",
  openGraph: {
    title: 'Bruno Simon',
    description: "Bruno Simon's creative portfolio",
    url: 'https://bruno-simon.com/',
    siteName: 'Three.js Journey',
    images: [{
      url: 'https://bruno-simon.com/social/share-image.png?cb=a',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bruno Simon',
    description: "Bruno Simon's creative portfolio",
    images: ['https://bruno-simon.com/social/share-image.png?cb=a'],
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicons/favicon.ico',
    apple: '/favicons/apple-touch-icon.png',
  },
  appleWebApp: {
    title: "Bruno's",
  },
  manifest: '/favicons/site.webmanifest',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${amaticSC.variable} ${pallyRegular.variable} ${pallyMedium.variable} ${pallyBold.variable}`}
    >
      <body>
        {/* Analytics */}
        {process.env.NEXT_PUBLIC_ANALYTICS_TAG && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_TAG}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_TAG}');
              `}
            </Script>
          </>
        )}

        {/* Font preloader (hidden) */}
        <div className="fonts-loader">
          <div className="font nunito" data-font="400 20px Nunito"> </div>
          <div className="font amatic-sc" data-font="700 20px 'Amatic SC'"> </div>
          <div className="font pally" data-font="500 20px Pally-Medium"> </div>
        </div>

        {children}
      </body>
    </html>
  )
}
