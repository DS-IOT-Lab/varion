import Project, {SourceFile} from "ts-simple-ast";

// @presence {NOT (F1) AND F2}
{
    import Project, {SourceFile} from "ts-simple-ast";
    import {VariabilityDetector} from "./VariabilityDetector";
}
// @presence {NOT (F1) AND F2}

import Project, {SourceFile} from "ts-simple-ast";
import {VariabilityDetector} from "./VariabilityDetector";

/**
 * @presence {F1}
 */
declare namespace TSExample {
    /**
     * @presence {NOT (F4 AND F1)}
     */
    enum Color { Red, Green, Blue }

    /**
     * @presence {F1 OR F2 AND NOT (F3)}
     */
    interface IStudent {
        // ...
    }

    /**
     * @presence {F1 AND F2}
     */
    class College {
        // ...
    }

    class Student extends College implements IStudent {
        // ...
        /**
         * @presence {F4}
         */
        public age() {
            // ...
        }
    }

    /**
     * @presence {NOT (F3)}
     */
    function greeter(student: Student) {
        // ...
    }

    // @presence {NOT (F1) AND F2}
    {
        let f = function (i: number) {
            return i + i;
        }
    }
    // ...
}
