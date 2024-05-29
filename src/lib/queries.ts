'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { prisma } from './db'
import { redirect } from 'next/navigation'
import { Agency, Plan, User } from '@prisma/client'

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

export const deleteAgency = async (agencyId: string) => {
  const response = await prisma.agency.delete({ where: { id: agencyId } })
  return response
}

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser()
  if (!user) return

  const userData = await prisma.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || 'SUBACCOUNT_USER',
    },
  })

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || 'SUBACCOUNT_USER',
    },
  })

  return userData
}

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>
) => {
  const response = await prisma.agency.update({
    where: { id: agencyId },
    data: { ...agencyDetails },
  })
  return response
}

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  if (!agency.companyEmail) return null
  try {
    const agencyDetails = await prisma.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SidebarOption: {
          create: [
            {
              name: 'Dashboard',
              icon: 'category',
              link: `/agency/${agency.id}`,
            },
            {
              name: 'Launchpad',
              icon: 'clipboardIcon',
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: 'Billing',
              icon: 'payment',
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: 'Settings',
              icon: 'settings',
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: 'Sub Accounts',
              icon: 'person',
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: 'Team',
              icon: 'shield',
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    })
    return agencyDetails
  } catch (error) {
    console.log(error)
  }
}
