"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

const FileUpload = ({ value, onChange, endpoint }: FileUploadProps) => {
  return (
    <div className="flex flex-col gap-2">
      {value !== "" && (
        <Image
          src={value}
          alt="groupChatImage"
          width={500}
          height={500}
          className="w-[280px] h-[200px] object-cover rounded-xl"
        />
      )}

      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error?.message}`);
        }}
        className="w-[280px] h-[200px]"
      />
    </div>
  );
};

export default FileUpload;
