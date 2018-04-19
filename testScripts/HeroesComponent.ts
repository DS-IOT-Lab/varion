import {Component} from '@angular/core';


/**
 * @presence f1 and f2
 */
@Component({
    selector: '',
    templateUrl: ''
})
export class HeroesComponent {

    constructor() {

    }
}

export class HeroAccessory {

    /**
     * @presence HelloWord1
     */
    public sayHelloWord1() {
        console.log('Hello Word!');
        console.log('Hello Word!');
        console.log('Hello Word!');
        console.log('Hello Word!');
        console.log('Hello Word!');
        console.log('Hello Word!');
    }


    /**
     * @presence HelloWord2
     */
    public sayHelloWord2() {
        console.log('< -- Hello Word! -- >');
    }

    public saySomething() {
        let x = Math.random() * 1000;

        // @presence myVar
        {
            let myVariable = 'something!';
            console.log('my Variable: '  + myVariable);
        }

        if(x % 3 == 0) {
            console.log('mod by 3 == 0');

            if (x % 7 == 0) {
                console.log('mod by 7 == 0');
            } else {
                console.log(' could divide by 7');
            }

            // @presence foo
            {
                console.log('Fooooooooooo !');
            }

        } else if(x % 3 == 1) {
            console.log('mode by 3 == 1');
        } else {

            // @presence bar
            {
                console.log('Baaaaaaaar');

                // @presence foo and bar
                {
                    console.log('Fooooooo And Baaaaaar');
                }

                // @presence foo or bar
                {
                    console.log('Fooooooo Or Baaaaaar');
                }
            }

            if (x % 11 == 0) {
                console.log('mod by 11 == 0');
            } else {
                console.log(' could divide by 11');
            }

        }
    }
}