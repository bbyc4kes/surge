-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `avatarUrl` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `role` ENUM('AGENCY_OWNER', 'AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST') NOT NULL DEFAULT 'SUBACCOUNT_USER',
    `agencyId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_agencyId_idx`(`agencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `subAccountId` VARCHAR(191) NOT NULL,
    `access` BOOLEAN NOT NULL,

    INDEX `Permissions_subAccountId_idx`(`subAccountId`),
    INDEX `Permissions_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agency` (
    `id` VARCHAR(191) NOT NULL,
    `connectAccountId` VARCHAR(191) NULL DEFAULT '',
    `customerId` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL,
    `agencyLogo` TEXT NOT NULL,
    `companyEmail` TEXT NOT NULL,
    `companyPhone` VARCHAR(191) NOT NULL,
    `whiteLabel` BOOLEAN NOT NULL DEFAULT true,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `goal` INTEGER NOT NULL DEFAULT 5,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubAccount` (
    `id` VARCHAR(191) NOT NULL,
    `connectAccountId` VARCHAR(191) NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL,
    `subAccountLogo` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `companyEmail` TEXT NOT NULL,
    `companyPhone` VARCHAR(191) NOT NULL,
    `goal` INTEGER NOT NULL DEFAULT 5,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `agencyId` VARCHAR(191) NOT NULL,

    INDEX `SubAccount_agencyId_idx`(`agencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `subAccountId` VARCHAR(191) NOT NULL,

    INDEX `Tag_subAccountId_idx`(`subAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pipeline` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `subAccountId` VARCHAR(191) NOT NULL,

    INDEX `Pipeline_subAccountId_idx`(`subAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lane` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `pipelineId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `Lane_pipelineId_idx`(`pipelineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `laneId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `value` DECIMAL(65, 30) NULL,
    `description` VARCHAR(191) NULL,
    `customerId` VARCHAR(191) NULL,
    `assignedUserId` VARCHAR(191) NULL,

    INDEX `Ticket_laneId_idx`(`laneId`),
    INDEX `Ticket_customerId_idx`(`customerId`),
    INDEX `Ticket_assignedUserId_idx`(`assignedUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trigger` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('CONTACT_FORM') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `subAccountId` VARCHAR(191) NOT NULL,

    INDEX `Trigger_subAccountId_idx`(`subAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Automation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `triggerId` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `subAccountId` VARCHAR(191) NOT NULL,

    INDEX `Automation_triggerId_idx`(`triggerId`),
    INDEX `Automation_subAccountId_idx`(`subAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AutomationInstance` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `automationId` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,

    INDEX `AutomationInstance_automationId_idx`(`automationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Action` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('CREATE_CONTACT') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `automationId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `laneId` VARCHAR(191) NOT NULL DEFAULT '0',

    INDEX `Action_automationId_idx`(`automationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `subAccountId` VARCHAR(191) NOT NULL,

    INDEX `Contact_subAccountId_idx`(`subAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `subAccountId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Media_link_key`(`link`),
    INDEX `Media_subAccountId_idx`(`subAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funnel` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `subDomainName` VARCHAR(191) NULL,
    `favicon` TEXT NULL,
    `subAccountId` VARCHAR(191) NOT NULL,
    `liveProducts` VARCHAR(191) NULL DEFAULT '[]',

    UNIQUE INDEX `Funnel_subDomainName_key`(`subDomainName`),
    INDEX `Funnel_subAccountId_idx`(`subAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassName` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `funnelId` VARCHAR(191) NOT NULL,
    `customData` LONGTEXT NULL,

    INDEX `ClassName_funnelId_idx`(`funnelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FunnelPage` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `pathName` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `visits` INTEGER NOT NULL DEFAULT 0,
    `content` LONGTEXT NULL,
    `order` INTEGER NOT NULL,
    `previewImage` TEXT NULL,
    `funnelId` VARCHAR(191) NOT NULL,

    INDEX `FunnelPage_funnelId_idx`(`funnelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgencySidebarOption` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT 'Menu',
    `link` VARCHAR(191) NOT NULL DEFAULT '#',
    `icon` ENUM('settings', 'chart', 'calendar', 'check', 'chip', 'compass', 'database', 'flag', 'home', 'info', 'link', 'lock', 'messages', 'notification', 'payment', 'power', 'receipt', 'shield', 'star', 'tune', 'videorecorder', 'wallet', 'warning', 'headphone', 'send', 'pipelines', 'person', 'category', 'contact', 'clipboardIcon') NOT NULL DEFAULT 'info',
    `agencyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AgencySidebarOption_agencyId_idx`(`agencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubAccountSidebarOption` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT 'Menu',
    `link` VARCHAR(191) NOT NULL DEFAULT '#',
    `icon` ENUM('settings', 'chart', 'calendar', 'check', 'chip', 'compass', 'database', 'flag', 'home', 'info', 'link', 'lock', 'messages', 'notification', 'payment', 'power', 'receipt', 'shield', 'star', 'tune', 'videorecorder', 'wallet', 'warning', 'headphone', 'send', 'pipelines', 'person', 'category', 'contact', 'clipboardIcon') NOT NULL DEFAULT 'info',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `subAccountId` VARCHAR(191) NULL,

    INDEX `SubAccountSidebarOption_subAccountId_idx`(`subAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invitation` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `agencyId` VARCHAR(191) NOT NULL,
    `status` ENUM('ACCEPTED', 'REVOKED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `role` ENUM('AGENCY_OWNER', 'AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST') NOT NULL DEFAULT 'SUBACCOUNT_USER',

    UNIQUE INDEX `Invitation_email_key`(`email`),
    INDEX `Invitation_agencyId_idx`(`agencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `notification` VARCHAR(191) NOT NULL,
    `agencyId` VARCHAR(191) NOT NULL,
    `subAccountId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Notification_agencyId_idx`(`agencyId`),
    INDEX `Notification_subAccountId_idx`(`subAccountId`),
    INDEX `Notification_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `plan` ENUM('price_1OYxkqFj9oKEERu1NbKUxXxN', 'price_1OYxkqFj9oKEERu1KfJGWxgN') NULL,
    `price` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `priceId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `currentPeriodEndDate` DATETIME(3) NOT NULL,
    `subscritiptionId` VARCHAR(191) NOT NULL,
    `agencyId` VARCHAR(191) NULL,

    UNIQUE INDEX `Subscription_subscritiptionId_key`(`subscritiptionId`),
    UNIQUE INDEX `Subscription_agencyId_key`(`agencyId`),
    INDEX `Subscription_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AddOns` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `priceId` VARCHAR(191) NOT NULL,
    `agencyId` VARCHAR(191) NULL,

    UNIQUE INDEX `AddOns_priceId_key`(`priceId`),
    INDEX `AddOns_agencyId_idx`(`agencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TagToTicket` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_TagToTicket_AB_unique`(`A`, `B`),
    INDEX `_TagToTicket_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
