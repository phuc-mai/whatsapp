import { UserButton } from "@clerk/nextjs";
import { MessageCircleMore, Users } from "lucide-react";
import Link from "next/link";

const SideBar = () => {
  const menu = [
    {
      name: "Chat",
      icon: <MessageCircleMore strokeWidth={1.25} />,
      path: "/",
    },
    {
      name: "Contacts",
      icon: <Users strokeWidth={1.25} />,
      path: "/contacts",
    },
  ];
  return (
    <div className="h-full flex flex-col py-3 px-1.5 border-r">
      <div className="flex-1 flex flex-col space-y-3">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="flex items-center space-x-2 p-2 rounded-md font-medium text-sm hover:bg-gray-100 cursor-pointer"
          >
            {item.icon}
            <span className="max-lg:hidden">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-2 p-2 rounded-md font-medium text-sm hover:bg-gray-100 cursor-pointer">
        <UserButton />
        <span className="max-lg:hidden">Profile</span>
      </div>
    </div>
  );
};

export default SideBar;
