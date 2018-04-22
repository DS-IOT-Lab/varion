# Varion: Variability Manager Project
`Varion` is a tool which enables developers to manage variabilities in their `Angular` project using pre-processor notation.


### Description:
In this project, we're implementing an approach based on the feature modeling technique to represent variability in ‍‍`Angular` applications and derive the final product based on the desired feature configuration model. We use `@presence` annotation to indicate the variation point in `TypeScript` files and `<presence> ... </presence>` tag to represent variation points in `HTML` files of an `Angular` project.

### Example:

Imagine the `JSON` file below describes the user desired configuration model:

```json
{
    ...
    "student": {
        "included": true,
        
        "education": {
            "gpa": false, 
            "major": true, 
        },
        
        "foo" : {
            "included": true,
            "hiccup": true
        },
        
        "language": {
            "persian": true,
            "english": false,
            "french": true
        }    
    }
}
```

Here we have a `TypeScript` file among all other files which has been annotated with the presence conditions at different points to indicate the variation points.


```TypeScript
/**
 * @presence {student.included}
 */
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
        console.log('Student foo');
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

            console.log('Hellowww World !!!');
            i++;
        }

}
```
