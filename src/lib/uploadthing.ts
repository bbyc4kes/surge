import { OurFileRouter } from '@/app/api/uploadthing/core'
import { generateReactHelpers } from '@uploadthing/react/hooks'
import { generateUploadDropzone } from '@uploadthing/react'
import { generateUploadButton } from '@uploadthing/react'

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>()
