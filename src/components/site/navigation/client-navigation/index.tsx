'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { LoaderCircleIcon, UserIcon } from 'lucide-react'

const ClientNavItems = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleLoginClick = () => {
    startTransition(() => {
      router.push('/agency')
    })
  }

  return (
    <aside className="flex gap-2 items-center">
      <button
        onClick={handleLoginClick}
        className={`bg-primary flex items-center justify-center text-white p-1 px-2 lg:p-2 lg:px-4 lg:w-32 w-24 rounded-md transition-colors ${isPending ? 'bg-primary/60' : 'hover:bg-primary/80'}`}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <LoaderCircleIcon
              className={`lg:h-4 lg:w-4 h-3 w-3 mr-2 ${isPending ? 'animate-spin' : ''}`}
            />
            Loading...
          </>
        ) : (
          <>
            <UserIcon
              className={`lg:h-4 lg:w-4 h-3 w-3 mr-2 ${isPending ? 'animate-spin' : ''}`}
            />
            Login
          </>
        )}
      </button>
      <UserButton />
      <ModeToggle />
    </aside>
  )
}

export default ClientNavItems
