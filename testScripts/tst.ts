
/**
 * @presence {f1 and f2 or f3}
 */
interface Person {
    name: string;
    age: number;
}

export default Person;

class Domi {

    /**
     * @presence {f1 and f2 or f3}
     */
    getGreeting() {
    console.log("!!!!!");

    // @variation {f1 and g2}
    {
        console.log("Hello!");
        console.log();
        console.log();
        console.log();
    }
    return "howdy";
}
}