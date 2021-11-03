interface IUserConfig {
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

interface IUser {
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

interface IUserCollection extends Iterator<IUser> {
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
