


/**
 * @variation { f1 && f2 || f3}
 */
function getGreeting() {
    console.log("!!!!!");

    // @variation {f1 && g2}
    {
        console.log("Hello!");
        console.log();
        console.log();
        console.log();
    }
    return "howdy";
}

/**
 * @variation { f1 && f2 || f3 || v1}
 */
class MyGreeter { }
