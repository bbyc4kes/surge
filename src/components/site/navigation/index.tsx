import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ClientNavItems from './client-navigation'

type Props = {
  user?: null
}

const Navigation = ({ user }: Props) => {
  return (
    <div className="p-4 flex items-center justify-between relative z-10">
      <aside className="flex items-center gap-2">
        <Image src="/surge-logo.svg" alt="Surge Logo" width={40} height={40} />
        <span className="text-xl font-bold">Surge.</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex gap-8 items-center justify-center">
          <li>
            <Link href="#">Pricing</Link>
          </li>
          <li>
            <Link href="#">Documentation</Link>
          </li>
          <li>
            <Link href="#">About</Link>
          </li>
          <li>
            <Link href="#">Services</Link>
          </li>
        </ul>
      </nav>
      <ClientNavItems />
    </div>
  )
}

export default Navigation
