// api to connect socket io
import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';

import { NextServer } from 'next/dist/server/next';
import { NextApiResponseServerIO } from '@/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NextServer = res.socket.server as any;
    // @ts-ignore
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    })
    res.socket.server.io = io;
  }
  res.end();
}

export default ioHandler;