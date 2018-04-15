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
    }

    /**
     * @presence HelloWord2
     */
    public sayHelloWord2() {
        console.log('< -- Hello Word! -- >');
    }
}