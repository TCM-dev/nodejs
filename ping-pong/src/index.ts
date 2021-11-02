import process from 'process';
import { ArgsParser } from './ArgsParser';

const argsParser: ArgsParser = new ArgsParser(process.argv);

const isServer = argsParser.isServer();
const address = argsParser.getAddress();
const port = argsParser.getListeningPort();

if (!isServer && !address) {
  console.log('Veuillez renseigner une adresse cible');
  process.exit();
}

console.log({ isServer });
console.log({ address });
console.log({ port });
