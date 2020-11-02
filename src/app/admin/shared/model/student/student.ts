import { User } from './../../../../shared/model/user/user';

export class Student extends User {
    password: string;
    dni: string;
}
