'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { prisma } from './db'
import { redirect } from 'next/navigation'
import {
  Agency,
  Lane,
  Plan,
  Prisma,
  Role,
  SubAccount,
  Tag,
  Ticket,
  User,
} from '@prisma/client'
import { v4 } from 'uuid'
import { CreateMediaType } from './types'

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

export const getMedia = async (subaccountId: string) => {
  const mediafiles = await prisma.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
    include: { Media: true },
  })
  return mediafiles
}

export const createMedia = async (
  subaccountId: string,
  mediaFile: CreateMediaType
) => {
  const response = await prisma.media.create({
    data: {
      link: mediaFile.link,
      name: mediaFile.name,
      subAccountId: subaccountId,
    },
  })

  return response
}

export const upsertContact = async (
  contact: Prisma.ContactUncheckedCreateInput
) => {
  const response = await prisma.contact.upsert({
    where: { id: contact.id || v4() },
    update: contact,
    create: contact,
  })
  return response
}

export const deleteMedia = async (mediaId: string) => {
  const response = await prisma.media.delete({
    where: {
      id: mediaId,
    },
  })
  return response
}

export const createTeamUser = async (agencyId: string, userData: User) => {
  if (userData.role === 'AGENCY_OWNER') return null

  const newUser = await prisma.user.create({
    data: { ...userData },
  })

  return newUser
}

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput
) => {
  const response = await prisma.pipeline.upsert({
    where: { id: pipeline.id || v4() },
    update: pipeline,
    create: pipeline,
  })

  return response
}

export const updateLanesOrder = async (lanes: Lane[]) => {
  try {
    const updateTrans = lanes.map((lane) =>
      prisma.lane.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      })
    )

    await prisma.$transaction(updateTrans)
    console.log('🟢 Done reordered 🟢')
  } catch (error) {
    console.log(error, 'ERROR UPDATE LANES ORDER')
  }
}

export const upsertTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[]
) => {
  let order: number
  if (!ticket.order) {
    const tickets = await prisma.ticket.findMany({
      where: { laneId: ticket.laneId },
    })
    order = tickets.length
  } else {
    order = ticket.order
  }

  const response = await prisma.ticket.upsert({
    where: {
      id: ticket.id || v4(),
    },
    update: { ...ticket, Tags: { set: tags } },
    create: { ...ticket, Tags: { connect: tags }, order },
    include: {
      Assigned: true,
      Customer: true,
      Tags: true,
      Lane: true,
    },
  })

  return response
}

export const getPipelines = async (subaccountId: string) => {
  const response = await prisma.pipeline.findMany({
    where: { subAccountId: subaccountId },
    include: {
      Lane: {
        include: { Tickets: true },
      },
    },
  })
  return response
}

export const searchContacts = async (searchTerms: string) => {
  const response = await prisma.contact.findMany({
    where: {
      name: {
        contains: searchTerms,
      },
    },
  })
  return response
}

export const getSubAccountTeamMembers = async (subaccountId: string) => {
  const subaccountUsersWithAccess = await prisma.user.findMany({
    where: {
      Agency: {
        SubAccount: {
          some: {
            id: subaccountId,
          },
        },
      },
      role: 'SUBACCOUNT_USER',
      Permissions: {
        some: {
          subAccountId: subaccountId,
          access: true,
        },
      },
    },
  })
  return subaccountUsersWithAccess
}

export const upsertTag = async (
  subaccountId: string,
  tag: Prisma.TagUncheckedCreateInput
) => {
  const response = await prisma.tag.upsert({
    where: { id: tag.id || v4(), subAccountId: subaccountId },
    update: tag,
    create: { ...tag, subAccountId: subaccountId },
  })

  return response
}

export const getTagsForSubaccount = async (subaccountId: string) => {
  const response = await prisma.subAccount.findUnique({
    where: { id: subaccountId },
    select: { Tags: true },
  })
  return response
}

export const deleteTag = async (tagId: string) => {
  const response = await prisma.tag.delete({ where: { id: tagId } })
  return response
}

export const deletePipeline = async (pipelineId: string) => {
  const response = await prisma.pipeline.delete({
    where: { id: pipelineId },
  })
  return response
}

export const deleteTicket = async (ticketId: string) => {
  const response = await prisma.ticket.delete({
    where: {
      id: ticketId,
    },
  })

  return response
}

export const getTicketsWithTags = async (pipelineId: string) => {
  const response = await prisma.ticket.findMany({
    where: {
      Lane: {
        pipelineId,
      },
    },
    include: { Tags: true, Assigned: true, Customer: true },
  })
  return response
}

export const deleteLane = async (laneId: string) => {
  const resposne = await prisma.lane.delete({ where: { id: laneId } })
  return resposne
}

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number

  if (!lane.order) {
    const lanes = await prisma.lane.findMany({
      where: {
        pipelineId: lane.pipelineId,
      },
    })

    order = lanes.length
  } else {
    order = lane.order
  }

  const response = await prisma.lane.upsert({
    where: { id: lane.id || v4() },
    update: lane,
    create: { ...lane, order },
  })

  return response
}

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTrans = tickets.map((ticket) =>
      prisma.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          laneId: ticket.laneId,
        },
      })
    )

    await prisma.$transaction(updateTrans)
    console.log('🟢 Done reordered 🟢')
  } catch (error) {
    console.log(error, '🔴 ERROR UPDATE TICKET ORDER')
  }
}

export const getPipelineDetails = async (pipelineId: string) => {
  const response = await prisma.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  })
  return response
}

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  const response = await prisma.lane.findMany({
    where: {
      pipelineId,
    },
    orderBy: { order: 'asc' },
    include: {
      Tickets: {
        orderBy: {
          order: 'asc',
        },
        include: {
          Tags: true,
          Assigned: true,
          Customer: true,
        },
      },
    },
  })
  return response
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

export const _getTicketsWithAllRelations = async (laneId: string) => {
  const response = await prisma.ticket.findMany({
    where: { laneId: laneId },
    include: {
      Assigned: true,
      Customer: true,
      Lane: true,
      Tags: true,
    },
  })
  return response
}

export const verifyAndAcceptInvitation = async () => {
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

export const getNotificationAndUser = async (agencyId: string) => {
  try {
    const response = await prisma.notification.findMany({
      where: { agencyId },
      include: { User: true },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return response
  } catch (error) {
    console.log(error)
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

export const getUserPermissions = async (userId: string) => {
  const response = await prisma.user.findUnique({
    where: { id: userId },
    select: { Permissions: { include: { SubAccount: true } } },
  })

  return response
}

export const deleteUser = async (userId: string) => {
  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      role: undefined,
    },
  })
  const deletedUser = await prisma.user.delete({ where: { id: userId } })

  return deletedUser
}

export const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  return user
}

export const updateUser = async (user: Partial<User>) => {
  const response = await prisma.user.update({
    where: { email: user.email },
    data: { ...user },
  })

  await clerkClient.users.updateUserMetadata(response.id, {
    privateMetadata: {
      role: user.role || 'SUBACCOUNT_USER',
    },
  })

  return response
}

export const changeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  permission: boolean
) => {
  try {
    const response = await prisma.permissions.upsert({
      where: { id: permissionId },
      update: { access: permission },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    })
    return response
  } catch (error) {
    console.log('🔴Could not change persmission', error)
  }
}

export const sendInvitation = async (
  role: Role,
  email: string,
  agencyId: string
) => {
  const resposne = await prisma.invitation.create({
    data: { email, agencyId, role },
  })

  try {
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      publicMetadata: {
        throughInvitation: true,
        role,
      },
    })
  } catch (error) {
    console.log(error)
    throw error
  }

  return resposne
}

export const upsertSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null
  const agencyOwner = await prisma.user.findFirst({
    where: {
      Agency: {
        id: subAccount.agencyId,
      },
      role: 'AGENCY_OWNER',
    },
  })
  if (!agencyOwner) return console.log('🔴Erorr could not create subaccount')
  const permissionId = v4()
  const response = await prisma.subAccount.upsert({
    where: { id: subAccount.id },
    update: subAccount,
    create: {
      ...subAccount,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      Pipeline: {
        create: { name: 'Lead Cycle' },
      },
      SidebarOption: {
        create: [
          {
            name: 'Launchpad',
            icon: 'clipboardIcon',
            link: `/subaccount/${subAccount.id}/launchpad`,
          },
          {
            name: 'Settings',
            icon: 'settings',
            link: `/subaccount/${subAccount.id}/settings`,
          },
          {
            name: 'Funnels',
            icon: 'pipelines',
            link: `/subaccount/${subAccount.id}/funnels`,
          },
          {
            name: 'Media',
            icon: 'database',
            link: `/subaccount/${subAccount.id}/media`,
          },
          {
            name: 'Automations',
            icon: 'chip',
            link: `/subaccount/${subAccount.id}/automations`,
          },
          {
            name: 'Pipelines',
            icon: 'flag',
            link: `/subaccount/${subAccount.id}/pipelines`,
          },
          {
            name: 'Contacts',
            icon: 'person',
            link: `/subaccount/${subAccount.id}/contacts`,
          },
          {
            name: 'Dashboard',
            icon: 'category',
            link: `/subaccount/${subAccount.id}`,
          },
        ],
      },
    },
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

export const deleteSubAccount = async (subaccountId: string) => {
  const response = await prisma.subAccount.delete({
    where: {
      id: subaccountId,
    },
  })
  return response
}

export const getSubaccountDetails = async (subaccountId: string) => {
  const response = await prisma.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  })
  return response
}
