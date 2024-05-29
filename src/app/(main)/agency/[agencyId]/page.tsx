import React from 'react'

const Page = ({ params }: { params: { agencyId: string } }) => {
  return <div>AgencyIdPage: {params.agencyId}</div>
}

export default Page
