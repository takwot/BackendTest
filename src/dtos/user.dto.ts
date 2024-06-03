import { IUser } from "../types/user.type";

export class IUserDto {
  first_name: string;
  last_name: string;
  email: string;
  gender: number;
  photo: string;
  constructor(data: IUser) {
    this.email = data.email;
    this.first_name = data.first_name;
    this.gender = data.gender;
    this.last_name = data.last_name;
    this.photo = data.photo;
  }
}
