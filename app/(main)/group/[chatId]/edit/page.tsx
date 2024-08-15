import { auth } from '@clerk/nextjs/server'
import React from 'react'

import CreateOrEditGroupChat from '@/components/contacts/CreateOrEditGroupChat'
import { getChatDetails } from '@/lib/actions/getChatDetails'
import { loggedinUser } from '@/lib/actions/loggedinUser'
import { db } from '@/lib/db'

const CreateGroupChatPage = async ({ params }: { params: { chatId: string }}) => {
  const user = await loggedinUser()

  if (!user) {
    return auth().redirectToSignIn()
  }

  const chatDetails = await getChatDetails(user.id, params.chatId)

  const contacts = await db.user.findMany({
    where: {
      id: {
        not: user.id,
      },
    },
  })

  return <CreateOrEditGroupChat contacts={contacts} page="edit" chatDetails={chatDetails} />
}

export default CreateGroupChatPage