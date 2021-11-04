import http from "http";
import { Server as SocketIOServer } from "socket.io";

export interface IUserConfig {
  /**
   * Identifiant de l'utilisateur
   *
   * @type {string}
   * @memberof IUserConfig
   */
  readonly id: string;
  /**
   * Pseudo éventuel de l'utilisateur
   *
   * @type {string}
   * @memberof IUserConfig
   */
  readonly pseudo?: string;
  /**
   * Url de l'éventuelle image de l'utilisateur
   *
   * @type {string}
   * @memberof IUserConfig
   */
  readonly imgUrl?: string;
  /**
   * Collection à l'intérieur de laquelle est enregistré l'utilisateur
   *
   * @type {IUserCollection}
   * @memberof IUserConfig
   */
  readonly collection: IUserCollection;
}

export interface IUser {
  /**
   * Identifiant de l'utilisateur
   *
   * @type {string}
   * @memberof IUserConfig
   */
  readonly id: string;
  /**
   * Pseudo éventuel de l'utilisateur
   *
   * @type {string}
   * @memberof IUserConfig
   */
  pseudo?: string;
  /**
   * Url de l'éventuelle image de l'utilisateur
   *
   * @type {string}
   * @memberof IUserConfig
   */
  imgUrl?: string;
  /**
   * Collection à l'intérieur de laquelle est enregistré l'utilisateur
   *
   * @type {IUserCollection}
   * @memberof IUserConfig
   */
  collection: IUserCollection;
  /**
   * Liste des identifiants des salons que l'utilisateur à joint
   *
   * @type {Array<string>}
   * @memberof IUser
   */
  rooms?: Array<string>;
  /**
   * Méthode permettant d'inclure l'utilisateur dans un salon
   *
   * @param {string} roomId
   * @memberof IUser
   */
  joinRoom(roomId: string): void;
  /**
   * Méthode permettant à un utilisateur de quitter un salon
   *
   * @param {string} roomId
   * @memberof IUser
   */
  leaveRoom(roomId: string): void;
}

export interface IUserCollection extends Iterator<IUser> {
  /**
   * Liste des identifiants des utilisateurs
   *
   * @type {Array<string>}
   * @memberof IUsers
   */
  readonly all: Array<string>;
  /**
   * Récupération des données d'un utilisateur dont l'identifiant est `id`
   *
   * @param {string} id
   * @returns {(IUser | false)}
   * @memberof IUsers
   */
  get(id: string): IUser | false;
  /**
   * Ajoute un utilisateur aux utilisateurs connus de cette collection
   *
   * @param {IUser} user
   * @memberof IUsers
   */
  add(user: IUser): void;
  /**
   * Supprime de cette collection un utilisateur avec l'identifiant `id` donné
   *
   * @param {string} id
   * @memberof IUserCollection
   */
  del(id: string): void;
}

export interface IWSServerConfig {
  /**
   * Instance du Serveur HTTP renvoyé par http.createServer()
   *
   * @type {http.Server}
   * @memberof IWSServerConfig
   */
  httpSrv: http.Server;
  /**
   * Eventuelle fonctione de log customisée.
   * Si aucune fonction n'est fournie, utiliser console.log
   *
   * @memberof IWSServerConfig
   */
  log?: (...args: Array<any>) => void;
}

export interface IWSServer {
  /**
   * Instance du serveur renvoyé par Socket.IO
   *
   * @type {SocketIOServer}
   * @memberof IWSServer
   */
  readonly server: SocketIOServer;
  /**
   * Liste des utilisateurs en ligne
   *
   * @type {IUserCollection}
   * @memberof IWSServer
   */
  readonly onlineUsers: IUserCollection;
  /**
   * Liste des salons connus du serveur
   *
   * @type {IRoomCollection}
   * @memberof IWSServer
   */
  readonly rooms: IRoomCollection;
}

export interface IMsg {
  /**
   * Horodatage du moment ou le serveur reçoit le message
   */
  readonly timestamp?: number;
  /**
   * Identifiant de l'utilisateur envoyant le message
   */
  readonly userId?: string;
  /**
   * Identifiant du salon dans lequel le message est envoyé
   */
  readonly roomId?: string;
  /**
   * Contenu du message
   */
  readonly msg: string;
}

export interface IRoomConfig {
  /**
   * Identifiant du salon
   *
   * @type {string}
   * @memberof IRoomConfig
   */
  readonly id: string;
  /**
   * Intitulé du salon
   *
   * @type {string}
   * @memberof IRoomConfig
   */
  readonly title: string;
  /**
   * Identifiant de l'éventuel administrateur du salon.
   * (S'il n'y a pas d'administrateur sur ce salon, on est sur un salon public)
   *
   * @type {string}
   * @memberof IRoomConfig
   */
  readonly adminId?: string;
  /**
   * URL éventuelle de l'image représentant le salon
   *
   * @type {string}
   * @memberof IRoomConfig
   */
  readonly urlImage?: string;
  /**
   * Collection des utilisateurs utilisée par le Web Socket Server
   *
   * @type {IUserCollection}
   * @memberof IRoomConfig
   */
  readonly usersCollection: IUserCollection;
  /**
   * Liste des identifiants des utilisateurs qui sont initialement joint au salon courant
   *
   * @type {Array<string>}
   * @memberof IRoomConfig
   */
  readonly prejoinedUsers?: Array<string>;
}

export interface IRoom {
  /**
   * Identifiant du salon
   *
   * @type {string}
   * @memberof IRoom
   */
  readonly id: string;
  /**
   * Intitulé du salon
   *
   * @type {string}
   * @memberof IRoom
   */
  title: string;
  /**
   * Liste des identifiants des users qui ont joint ce salon
   *
   * @type {Array<string>}
   * @memberof IRoom
   */
  readonly joinedUsers: Array<string>;
  /**
   * Le salon est-il public?
   *
   * @type {boolean}
   * @memberof IRoom
   */
  readonly public: boolean;
  /**
   * Si le salon est privé, identifiant de l'administrateur du salon.
   * Si le salon est public -> FALSE
   *
   * @type {(string | false)}
   * @memberof IRoom
   */
  readonly adminId: string | false;
  /**
   * URL éventuelle de l'image représentant le salon
   *
   * @type {string}
   * @memberof IRoom
   */
  readonly urlImage: string | false;
  /**
   * Joindre l'utilisateur d'identifiant `userId` à ce salon
   *
   * @param {string} userId
   * @returns {boolean}
   * @memberof IRoom
   */
  joinUser(userId: string): boolean;
  /**
   * Retirer l'utilisateur d'identifiant `userId` de ce salon
   *
   * @param {string} userId
   * @memberof IRoom
   */
  leaveUser(userId: string): void;
}

export interface IRoomCollection extends Iterator<IRoom> {
  /**
   * Liste des identifiants des salons
   *
   * @type {Array<string>}
   * @memberof IRoomCollection
   */
  readonly all: Array<string>;
  /**
   * Récupération des données d'un salon dont l'identifiant est `id`
   *
   * @param {string} id
   * @returns {(IRoom | false)}
   * @memberof IRoomCollection
   */
  get(id: string): IRoom | false;
  /**
   * Ajoute un salon aux salons connus de cette collection
   *
   * @param {IRoom} room
   * @memberof IRoomCollection
   */
  add(room: IRoom): void;
  /**
   * Supprime de cette collection un salon avec l'identifiant `id` donné
   *
   * @param {string} id
   * @memberof IRoomCollection
   */
  del(id: string): void;
}
