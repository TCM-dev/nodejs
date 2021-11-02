import { isIPv4 } from 'net';

interface IArgsParser {
  isServer(): boolean;

  getListeningPort(): number;

  getAddress(): string | false;
}

export class ArgsParser implements IArgsParser {
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  isServer(): boolean {
    return this.args.indexOf('server') !== -1;
  }

  getListeningPort(): number {
    const listeningPort = this.args.find((arg) => {
      const argInt = parseInt(arg);

      if (argInt > 10000 && argInt < 65535) {
        return argInt;
      }
    });

    if (!listeningPort) {
      return 23456;
    }

    return parseInt(listeningPort);
  }

  getAddress(): string | false {
    if (!this.isServer()) {
      const address = this.args.find((arg) => isIPv4(arg));

      if (!address) {
        return false;
      }

      return address;
    }

    return false;
  }
}
