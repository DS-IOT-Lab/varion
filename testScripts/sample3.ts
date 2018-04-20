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

        // @presence gpa and major
        {
            console.log('\t major: ' + this.major + ', GPA: ' + this.gpa);
        }

        // @presence gpa and not (major)
        {
            console.log('\t GPA: ' + this.gpa);
        }

        // @presence major and not (gpa)
        {
            console.log('\t major: ' + this.major);
        }
    }

    /**
     * @presence foo
     */
    public foo() {
        console.log('Student foo');
        let hiccup = Math.random() * 10;
        let i = 0;

        while (i < hiccup) {

            // @presence hiccup
            {
                let chance = Math.floor(Math.random() * 5);
                if (chance % 2 == 0) {
                    console.log('Hic!');
                }
            }

            console.log('Hellowww World !!!');
            i++;
        }
    }

    public greetings(peopleNumber: number) {
        console.log(' Student Greetings');
        let i = 0;

        do {
            // @presence language.english
            {
                console.log('person #' + i + ': Hello!');
            }

            // @presence language.persian
            {
                console.log('person #' + i + ': Salam!');
            }

            // @presence language.french
            {
                console.log('person #' + i + ': Bonjour!')
            }

            i++;
        } while (i < peopleNumber);
    }

}

let johnWick = new Student('John Wick', 9312430379, 'B.Sc Assassination Engineering', 20.00);
johnWick.toString();
johnWick.foo();
johnWick.greetings(5);