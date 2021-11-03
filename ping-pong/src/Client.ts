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
    const now = Date.now();

    const socket = new Socket();

    socket.connect({
      port: this.port,
      path: this.address,
    });

    return new Promise((resolve) => {
      // If connect return milliseconds
      // If error return false
      socket.on('connect', resolve);
      socket.on('error', )
    });
  }
}