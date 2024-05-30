import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

type Props = {
  params: { agencyId: string }
}

const SettingsPage = async ({ params }: Props) => {
  const authUser = await currentUser()

  if (!authUser) return null
  const userDetails = await prisma.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
  })
  return <div>SettingsPage</div>
}

export default SettingsPage
