export class Grade {
  GradeID: string;        // CHAR(8)
  StudentID: string;      // CHAR(8)
  AssessID: string;       // CHAR(8)
  Score: number;          // DECIMAL(4,2)
  GradeLetter: string;    // ENUM
  DateRecorded: Date;     // DATE
}
