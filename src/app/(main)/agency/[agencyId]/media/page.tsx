import MediaComponent from '@/components/media'
import BlurPage from '@/components/shared/blur-page'
import { getMedia } from '@/lib/queries'
import React from 'react'

type Props = {
  params: { subaccountId: string }
}

const MediaPage = async ({ params }: Props) => {
  const data = await getMedia(params.subaccountId)

  return (
    <BlurPage>
      <MediaComponent data={data} subaccountId={params.subaccountId} />
    </BlurPage>
  )
}

export default MediaPage
