import Image from "next/image";

const EmptyChat = () => {
  return (
    <div className="h-full flex flex-col gap-2 items-center justify-center">
      <Image src="/logo.png" alt="Empty Chat" width={70} height={70} />
      <p className="text-xl font-bold">WhatsApp</p>
      <p className="text-md text-gray-500 text-center">Send and Receive messages without keeping your phone online</p>
    </div>
  );
};

export default EmptyChat;
