import { EntryLog } from "./entrylog";
import { User } from "./user";
import { QmUser } from "./qmuser";

export class ActivityBook {
    private entryArray: Array<EntryLog>;
    private qmUser: QmUser;
    constructor() {
        this.entryArray = new Array<EntryLog>();
        this.qmUser = new QmUser("DEFAULT-NAME")
    }
    getLogs() {
        return this.entryArray;
    }

    logEntry(entry:EntryLog) {
        this.entryArray.push(entry)
    }

    getQmUser() {
        return this.qmUser;
    }

    setQM(name: string) {
        this.qmUser.setName(name);
    }

    removeLog(pushID:string){
        let i = this.entryArray.findIndex( (t:EntryLog) => {
            return t.pushID == pushID;
        });
        this.entryArray.splice(i,1);
    }
}