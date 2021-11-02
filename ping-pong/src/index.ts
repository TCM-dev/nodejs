import process from 'process';
import { ArgsParser } from './ArgsParser';

const argsParser: ArgsParser = new ArgsParser(process.argv);

const isServer = argsParser.isServer();
const address = argsParser.getAddress();
const port = argsParser.getListeningPort();

if (isServer) {
  console.log(`Try listening on 127.0.0.1:${port}`);
} else {
  if (address) {
    console.log(`You are pinging ${address}`);
  } else {
    console.error('Please specify a correct IPv4 address');
  }
}

// console.log({ isServer });
// console.log({ address });
// console.log({ port });
