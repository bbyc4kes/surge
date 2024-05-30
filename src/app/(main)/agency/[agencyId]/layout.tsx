import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import NotAuthorized from '@/components/shared/not-authorized'
import Sidebar from '@/components/sidebar'
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from '@/lib/queries'
import { redirect } from 'next/navigation'
import InfoBar from '@/components/shared/info-bar'
import BlurPage from '@/components/shared/blur-page'

type Props = {
  children: React.ReactNode
  params: { agencyId: string }
}

const layout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitation()
  const user = await currentUser()

  if (!user) {
    return redirect('/')
  }

  if (!agencyId) {
    return redirect('/agency')
  }

  if (
    user.privateMetadata.role !== 'AGENCY_OWNER' &&
    user.privateMetadata.role !== 'AGENCY_ADMIN'
  )
    return <NotAuthorized />

  let allNoti: any = []
  const notifications = await getNotificationAndUser(agencyId)
  if (notifications) allNoti = notifications

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar notifications={allNoti} role={allNoti.User?.role} />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  )
}

export default layout
