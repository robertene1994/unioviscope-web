import { Syllabus } from './../../../admin/shared/model/syllabus/syllabus';

export class Subject {
    id: number;
    code: string;
    denomination: string;
    course: string;
    temporality: string;
    type: string;
    credits: number;
    syllabus: Syllabus;
}
