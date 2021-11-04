import { IRoom, IRoomCollection, IRoomConfig } from "./interfaces";

export class Room implements IRoom {
  id: string;
  title: string;
  joinedUsers: string[];
  public: boolean;
  adminId: string | false;
  urlImage: string | false;

  constructor(config: IRoomConfig) {
    this.id = config.id;
    this.title = config.title;
    this.adminId = config.adminId || false;
    this.urlImage = config.urlImage || false;
    this.public = this.adminId ? false : true;
    this.joinedUsers = this.adminId
      ? config.prejoinedUsers || [this.adminId]
      : config.prejoinedUsers || [];
  }

  joinUser(userId: string): boolean {
    if (this.joinedUsers.includes(userId)) {
      return false;
    }

    this.joinedUsers.push(userId);
    return true;
  }

  leaveUser(userId: string): void {
    const userIndex = this.joinedUsers.indexOf(userId);
    if (userIndex === -1) {
      return;
    }

    this.joinedUsers.splice(userIndex, 1);
  }
}

export class RoomCollection implements IRoomCollection {
  private rooms: Room[];
  private currentIndex: number = 0;

  constructor(rooms: Room[]) {
    this.rooms = rooms;
  }

  public get all(): string[] {
    return this.rooms.map((room) => room.id);
  }

  get(id: string): false | IRoom {
    return this.rooms.find((user) => user.id === id) || false;
  }

  add(room: IRoom): void {
    const roomIndex = this.rooms.findIndex(
      (existingRoom) => existingRoom.id === room.id
    );

    if (roomIndex !== -1) {
      return;
    }

    this.rooms.push(room);
  }

  del(id: string): void {
    const roomIndex = this.rooms.findIndex((room) => room.id === id);

    if (roomIndex === -1) {
      return;
    }

    this.rooms.splice(roomIndex, 1);
  }

  next(): IteratorResult<IRoom> {
    if (this.currentIndex >= this.rooms.length) {
      // Reset to 0 ?
      return {
        value: null,
        done: true,
      };
    }

    return {
      value: this.rooms[this.currentIndex++],
      done: false,
    };
  }
}
