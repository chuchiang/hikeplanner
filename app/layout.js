import Link from 'next/link'
import { Rammetto_One, Noto_Sans_TC } from 'next/font/google'
import './globals.css'

const rammettoOne = Rammetto_One({
  subsets: ['latin'],
  weight: '400'
})

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
})


function Header() {
  return (
    <div className='bg-DAD1C5'>
      <div className='mx-auto w-1296 flex justify-between'>
        <Link href='/'>
          <div className='flex items-center'>
            <img className='w-12' src='/logo.png' alt='logo'></img>
            <h3 className={`${rammettoOne.className} text-2xl co-434E4E`}>HikePlanner</h3>
          </div>
        </Link>
        <div className='flex space-x-4 items-center'>
          <Link href='/planning' className='co-5B6E60 font-medium'>規劃助手</Link>
          <Link href='/planning' className='co-5B6E60 font-medium'>行程分享</Link>
          <Link href='/planning' className='co-5B6E60 font-medium'>會員中心</Link>
        </div>
      </div>
    </div>)
}


export const metadata = {
  title: 'HikePlanner',
  description: 'Your exclusive hiking route planning platform',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={notoSansTC.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
