'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { prisma } from './db'
import { redirect } from 'next/navigation'
import { User } from '@prisma/client'

export const getAuthUserDetails = async () => {
  const authUser = await currentUser()
  if (!authUser) {
    return null
  }
  const userData = await prisma.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  })

  return userData
}

export const createTeamUser = async (agencyId: string, userData: User) => {
  if (userData.role === 'AGENCY_OWNER') return null

  const newUser = await prisma.user.create({
    data: { ...userData },
  })

  return newUser
}

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string
  description: string
  subaccountId?: string
}) => {
  const authUser = await currentUser()

  let userData
  if (!authUser) {
    const response = await prisma.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: subaccountId },
          },
        },
      },
    })

    if (response) {
      userData = response
    }
  } else {
    userData = await prisma.user.findUnique({
      where: { email: authUser?.emailAddresses[0].emailAddress },
    })
  }

  if (!userData) {
    console.log('User was not found in the database')
    return
  }

  let foundAgencyId = agencyId
  if (!foundAgencyId) {
    if (!subaccountId) {
      throw new Error(
        'AgencyId or subaccountId are required to save activity logs notification'
      )
    }
    const response = await prisma.subAccount.findUnique({
      where: { id: subaccountId },
    })
    if (response) foundAgencyId = response.agencyId
  }
  if (subaccountId) {
    await prisma.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        SubAccount: {
          connect: { id: subaccountId },
        },
      },
    })
  } else {
    await prisma.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    })
  }
}

export const verifyAndAccessInvitation = async () => {
  const authUser = await currentUser()

  if (!authUser) {
    redirect('/agency/sign-in')
  }

  const invitation = await prisma.invitation.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
      status: 'PENDING',
    },
  })

  if (invitation) {
    const userDetails = await createTeamUser(invitation.agencyId, {
      email: invitation.email,
      agencyId: invitation.agencyId,
      avatarUrl: authUser.imageUrl,
      id: authUser.id,
      name: `${authUser.firstName} ${authUser.lastName}`,
      role: invitation.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await saveActivityLogsNotification({
      agencyId: invitation?.agencyId,
      description: `Joined`,
      subaccountId: undefined,
    })

    if (userDetails) {
      await clerkClient.users.updateUserMetadata(authUser.id, {
        privateMetadata: {
          role: userDetails.role || 'SUBACCOUNT_USER',
        },
      })

      await prisma.invitation.delete({
        where: { email: userDetails.email },
      })

      return userDetails.agencyId
    } else return null
  } else {
    const agency = await prisma.user.findUnique({
      where: {
        email: authUser.emailAddresses[0].emailAddress,
      },
    })
    return agency ? agency.agencyId : null
  }
}
