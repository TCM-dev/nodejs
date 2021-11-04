import { IUser, IUserCollection, IUserConfig } from "./interfaces";

export class User implements IUser {
  id: string;
  pseudo?: string | undefined;
  imgUrl?: string | undefined;
  collection: IUserCollection;
  rooms?: string[] | undefined;

  constructor(config: IUserConfig) {
    this.id = config.id;
    this.pseudo = config.pseudo;
    this.imgUrl = config.imgUrl;
    this.collection = config.collection;
  }

  joinRoom(roomId: string): void {
    // Probably need to add more logic here
    this.rooms?.push(roomId);
  }

  leaveRoom(roomId: string): void {
    const roomIndex = this.rooms?.indexOf(roomId);

    if (!roomIndex || roomIndex === -1) {
      return;
    }

    this.rooms?.splice(roomIndex, 1);
  }
}

export class UserCollection implements IUserCollection {
  private users: User[];
  private currentIndex: number = 0;

  constructor(users: User[]) {
    this.users = users;
  }

  public get all(): string[] {
    return this.users.map((user) => user.id);
  }

  get(id: string): false | IUser {
    return this.users.find((user) => user.id === id) || false;
  }

  add(user: IUser): void {
    const userIndex = this.users.findIndex(
      (existingUser) => existingUser.id === user.id
    );

    if (userIndex !== -1) {
      return;
    }

    this.users.push(user);
  }

  del(id: string): void {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    this.users.splice(userIndex, 1);
  }

  next(): IteratorResult<IUser> {
    if (this.currentIndex >= this.users.length) {
      // Reset to 0 ?
      return {
        value: null,
        done: true,
      };
    }

    return {
      value: this.users[this.currentIndex++],
      done: false,
    };
  }
}
