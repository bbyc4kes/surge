import Stripe from 'stripe'
import { Prisma, Role } from '@prisma/client'
import {
  _getTicketsWithAllRelations,
  getAuthUserDetails,
  getMedia,
  getUserPermissions,
} from './queries'

export type NotificationWithUser =
  | ({
      User: {
        id: string
        name: string
        avatarUrl: string
        email: string
        createdAt: Date
        updatedAt: Date
        role: Role
        agencyId: string | null
      }
    } & Notification)[]
  | undefined

export type TicketDetails = Prisma.PromiseReturnType<
  typeof _getTicketsWithAllRelations
>
export type PricesList = Stripe.ApiList<Stripe.Price>

export type AuthUserWithAgencySigebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>

export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput
