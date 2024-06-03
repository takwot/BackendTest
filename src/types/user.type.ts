export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: number;
  photo: string;
}

export interface IUserReg {
  first_name: string;
  email: string;
  password: string;
}
