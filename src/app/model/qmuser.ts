export class QmUser {
    name: string;
    lastchange: Date;
    constructor(name: string) {
        this.name = name;
        this.lastchange = new Date();
    }
    setName(name){
        this.name = name;
    }
    getName(){
        return this.name;
    }
}