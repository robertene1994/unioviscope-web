import { CourseSubject } from './../course-subject/course-subject';

export class Group {
    id: number;
    code: string;
    type: string;
    subject: CourseSubject;
}
