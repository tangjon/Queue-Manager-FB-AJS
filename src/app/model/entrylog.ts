import { QmUser } from "./qmuser";

export class EntryLog {
    action: string;
    private queueManager: QmUser;
    private date: Date;
    description: string;
    userName: string;
    iNumber: string;
    pushID: string;
    constructor(userName, iNumber, action, description, queueManager: QmUser, pushID:string) {
        this.action = action;
        this.queueManager = queueManager;
        this.description = description;
        this.iNumber = iNumber;
        this.userName = userName;
        this.pushID = pushID;
        this.date = new Date();
    }
    getManager() {
        return this.queueManager;
    }

    getTime() {
        return this.date.getHours().toString() + ':'
            + this.date.getMinutes().toString() + ':'
            + this.date.getSeconds().toString();
    }

    getDate() {
        let month = this.date.getMonth();
        let day = this.date.getDay();
        let year = this.date.getFullYear();
        return " " + month + '/' + day + '/' + year;
    }

    getSummary() {
        let string = '[' + this.action + ']' + " : " + this.userName + '(' + this.iNumber + ')' + " : " + this.description;
        return string;
    }

    getFullDate(){
        return this.date;
    }

    setDate(date: Date){
        this.date = date;
    }

    setDateFromString(date: string){
        date = date.replace(/['"]+/g, '');
        this.date = new Date(date);
    }
}