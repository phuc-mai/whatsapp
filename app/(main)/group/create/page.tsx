import CreateGroupChat from '@/components/contacts/CreateGroupChat'
import { loggedinUser } from '@/lib/actions/loggedinUser'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const CreateGroupChatPage = async () => {
  const user = await loggedinUser()

  if (!user) {
    return auth().redirectToSignIn()
  }

  const contacts = await db.user.findMany({
    where: {
      id: {
        not: user.id,
      },
    },
  })

  return <CreateGroupChat contacts={contacts} />
}

export default CreateGroupChatPage