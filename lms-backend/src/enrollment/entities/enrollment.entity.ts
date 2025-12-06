export class Enrollment {
  EnrollID: string;
  StudentID: string;
  CourseID: string;
  Status: 'Enrolled' | 'Completed' | 'Dropped';
  Semester: string;
  GradeFinal?: number;
  Schedule?: string;
  InstructorID?: string;
}
