class Car {
    private companyName: string;
    private topSpeed: number;
    private color: string;

    constructor(companyName, topSpeed, color) {
        this.companyName = companyName;
        this.topSpeed = topSpeed;
        this.color = color;
    }

    public describe() {
        console.log('Manufacturer:' + this.companyName);
        console.log('Top Speed: ' + this.topSpeed);
        console.log('Color: ' + this.color);
    }

    /**
     * @presence {Car.bonusBoost}
     */
    private bonusBoost() {
        this.topSpeed = this.topSpeed * 1.25;
    }


    public boost() {

        // @presence {Car.bonusBoost}
        {
            this.bonusBoost();
        }

        this.topSpeed = this.topSpeed * 1.1;
    }

}

/**
 * @presence {Car.driverInterfaceEnabled} 
 */
interface Driver {
    name?: string;
    licenseNumber: number;
    nickname?: string;
}



let Dena = new Car('Iran Khodro', 210, 'White');
Dena.describe();
Dena.boost();
Dena.describe();


