export class CreateAccountDto {
  idx!: number;
  name!: string;
  id!: string;
  password!: string;
  email!: string;
  gender!: string;
  roleIdx!: number;

  constructor(data: {
    idx: number;
    name: string;
    id: string;
    password: string;
    email: string;
    gender: string;
    roleIdx: number;
  }) {
    this.idx = data.idx;
    this.name = data.name;
    this.id = data.id;
    this.password = data.password;
    this.email = data.email;
    this.gender = data.gender;
    this.roleIdx = data.roleIdx;
  }
}
