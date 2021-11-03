import { Socket } from 'net';

interface IClientConfig {
  /**
   * Adresse du serveur à pinguer
   *
   * @type {string}
   * @memberof IClientConfig
   */
  readonly address: string;
  /**
   * Port du serveur à pinguer
   *
   * @type {number}
   * @memberof IClientConfig
   */
  readonly port: number;
  /**
   * Méthode custom optionnelle de log (Idem que serveur)
   *
   * @memberof IClientConfig
   */
  readonly log?: (...args: Array<any>) => void;
  /**
   * Méthode custom optionnelle d'erreur (Idem que serveur)
   *
   * @memberof IClientConfig
   */
  readonly error?: (...args: Array<any>) => void;
}

interface IClient {
  /**
   * Ping un serveur.
   * Récupère un temps de début en millisecondes
   * Se connecte à un serveur, lui envoit la chaine "PING", et attends de recevoir la réponse ("PONG")
   * Récupère un temps de fin en millisecondes
   * Renvoie la durée du ping (fin - début)
   *
   * @returns {(Promise<number | false>)}
   * @memberof IClient
   */
  ping(): Promise<number | false>;
}

export class Client implements IClient {
  port: number;
  address: string;
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;

  constructor(config: IClientConfig) {
    const voidMethod = () => {};
    this.port = config.port;
    this.address = config.address;
    this.log = config.log || voidMethod;
    this.error = config.error || voidMethod;
  }

  ping(): Promise<number | false> {
    const start = Date.now();

    const socket = new Socket();

    socket.connect({
      port: this.port,
      host: this.address,
    });

    return new Promise((resolve) => {
      const end = Date.now();
      socket.on('connect', () => resolve(end - start));
      socket.on('error', (err) => {
        console.log(err)
        resolve(false);
      });
    });
  }
}
