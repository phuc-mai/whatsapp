"use client";

import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ContactListProps {
  contacts: User[];
}

const ContactList = ({ contacts }: ContactListProps) => {
  const [search, setSearch] = useState("");
  const [filteredContacts, setFilteredContacts] = useState<User[]>(contacts);

  useEffect(() => {
    if (search === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [search, contacts]);

  return (
    <div className="p-5 flex flex-col space-y-5 overflow-hidden">
      <h2 className="text-xl font-bold">All Contacts</h2>
      <Link href={`/group/create`}>
        <Button className="w-full">Create Group Chat</Button>
      </Link>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search size={14} className="text-gray-500" />
        </span>
        <Input
          type="text"
          className="pl-8"
          placeholder="Search contacts..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-2 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <Link
            key={contact.id}
            href={`/?queryId=${contact.id}`}
            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
          >
            <Image
              src={contact.imageUrl}
              alt={contact.name}
              width={50}
              height={50}
              className="rounded-full h-8 w-8"
            />
            <p className="text-md font-semibold">{contact.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
