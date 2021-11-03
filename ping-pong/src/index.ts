import process from 'process';
import { ArgsParser } from './ArgsParser';
import { Client } from './Client';
import { Server } from './Server';

const argsParser: ArgsParser = new ArgsParser(process.argv);

const isServer = argsParser.isServer();
const address = argsParser.getAddress();
const listeningPort = argsParser.getListeningPort();

if (isServer) {
  console.log(`Try listening on 127.0.0.1:${listeningPort}`);

  const server = new Server({
    listeningPort,
    onData: (socket, data) => console.log({ socket }, { data }),
    log: (log) => console.log({ log }),
    error: (error) => console.error({ error }),
  });

  server.listen();
} else {
  if (address) {
    console.log(`You are pinging ${address}`);
    const client = new Client({
      port: listeningPort,
      address,
    });

    client.ping().then((delay) => {
      console.log(delay + 'ms');
    });
  } else {
    console.error('Please specify a correct IPv4 address');
  }
}

// console.log({ isServer });
// console.log({ address });
// console.log({ port });
