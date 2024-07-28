export class InsertAccountDao {
  userName: string;
  idValue: string;
  pwValue: string;
  email: string;
  birth: Date;
  gender: string;
  roleIdx: number;

  constructor(data: {
    userName: string;
    idValue: string;
    pwValue: string;
    email: string;
    birth: Date;
    gender: string;
    roleIdx: number;
  }) {
    this.userName = data.userName;
    this.idValue = data.idValue;
    this.pwValue = data.pwValue;
    this.email = data.email;
    this.birth = data.birth;
    this.gender = data.gender;
    this.roleIdx = data.roleIdx;
  }
}
