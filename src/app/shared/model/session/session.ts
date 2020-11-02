import { Group } from './../group/group';
import { CourseSubject } from './../course-subject/course-subject';

export class Session {
    id: number;
    start: number;
    end: number;
    location: string;
    description: string;
    group: Group;
    subject: CourseSubject;
}
