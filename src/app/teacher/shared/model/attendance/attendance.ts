import { StudentNaturalGroup } from './../student-natural-group/student-natural-group';
import { Session } from './../../../../shared/model/session/session';

export class Attendance {
    confirmed: boolean;
    date: number;
    comment: string;
    faceRecognitionOff: boolean;
    student: StudentNaturalGroup;
    session: Session;
}
