class Student {
    private name: string;
    private studentNumber: number;
    private major: string;
    private gpa: number;


    public constructor(name: string, studentNumber: number, major: string, gpa: number){
        this.name = name;
        this.studentNumber = studentNumber;
        this.major = major;
        this.gpa = gpa;
    }

    public toString(){
        console.log('Info:\n\t student_number: ' + this.studentNumber + '\n\t name: '+ this.name);

        // @presence gpa and major
        {
            console.log('\t major: ' + this.major + ', GPA: ' + this.gpa);
        }

    }

}

let johnWick = new Student('John Wick', 9312430379, 'B.Sc Assassination Engineering', 20.00);
johnWick.toString();