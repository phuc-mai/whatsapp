import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import ContactList from "@/components/contacts/ContactList";
import { loggedinUser } from "@/lib/actions/loggedinUser";

const ContactsPage = async () => {
  const user = await loggedinUser();

  if (!user) {
    return auth().redirectToSignIn();
  }

  const contacts = await db.user.findMany({
    where: {
      id: {
        not: user.id,
      },
    },
  });

  return <ContactList contacts={contacts} />
};

export default ContactsPage;
