import { User } from "@prisma/client";
import { Circle, CircleCheckBig, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Input } from "../ui/input";

interface SelectContactsProps {
  contacts: User[];
  selectedContacts: User[];
  onSelectContact: (contact: User) => void;
}

const SelectContacts = ({
  contacts,
  selectedContacts,
  onSelectContact,
}: SelectContactsProps) => {
  const [search, setSearch] = useState("");
  const [filteredContacts, setFilteredContacts] = useState<User[]>(contacts);

  useEffect(() => {
    const timeId = setTimeout(() => {
      if (search === "") {
        setFilteredContacts(contacts);
      } else {
        const filtered = contacts.filter((contact) =>
          contact.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredContacts(filtered);
      }
    }, 1000);

    return () => clearTimeout(timeId);
  }, [search, contacts]);

  return (
    <div className="flex flex-col gap-5">
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
      <div className="flex flex-col space-y-5 overflow-hidden">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-3 hover:cursor-pointer"
            onClick={() => onSelectContact(contact)}
          >
            {selectedContacts.some((selected) => selected.id === contact.id) ? (
              <CircleCheckBig size={18} className="text-emerald-500" />
            ) : (
              <Circle size={18} />
            )}
            <Image
              src={contact.imageUrl}
              alt={contact.name}
              width={50}
              height={50}
              className="rounded-full h-8 w-8"
            />
            <p className="text-md font-semibold">{contact.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectContacts;
