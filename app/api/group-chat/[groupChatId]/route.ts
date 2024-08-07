import { loggedinUser } from "@/lib/actions/loggedinUser";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: NextApiRequest,
  { params }: { params: { groupChatId: string } }
) => {
  try {
    const user = await loggedinUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.groupChatId) {
      return new NextResponse("Group chat ID missing", { status: 400 });
    }

    await db.chat.delete({
      where: {
        id: params.groupChatId,
        adminId: user.id,
      },
    });
    
    return new NextResponse("Group chat deleted", { status: 200 });
  } catch (err) {
    console.log("[group-chat_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
