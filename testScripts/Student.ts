class Student {
    private name: string;
    private studentNumber: number;
    private major: string;
    private gpa: number;


    public constructor(name: string, studentNumber: number, major: string, gpa: number) {
        this.name = name;
        this.studentNumber = studentNumber;
        this.major = major;
        this.gpa = gpa;
    }

    public toString() {
        console.log('Info:\n\t student_number: ' + this.studentNumber + '\n\t name: ' + this.name);

        // @presence {student.education.gpa and student.education.major}
        {
            console.log('\t major: ' + this.major + ', GPA: ' + this.gpa);
        }

        // @presence {student.education.gpa and not (student.education.major)}
        {
            console.log('\t GPA: ' + this.gpa);
        }

        // @presence {student.education.major and not (student.education.gpa)}
        {
            console.log('\t major: ' + this.major);
        }
    }

    /**
     * @presence {student.foo.included}
     */
    public foo() {
        let hiccup = Math.random() * 10;
        let i = 0;

        while (i < hiccup) {

            // @presence {student.foo.hiccup}
            {
                let chance = Math.floor(Math.random() * 5);
                if (chance % 2 == 0) {
                    console.log('Hic!');
                }
            }

            // @presence {student.language.persian}
            {
                console.log('Salam!');
            }

            // @presence {student.language.french}
            {
                console.log('Bonjour!');
            }

            // @presence {student.language.english}
            {
                console.log('Hey!');
            }

            i++;
        }


    }
}

let john = new Student('John Wick', 9312430379, 'Master of Assassination', 4.00);
john.foo();
