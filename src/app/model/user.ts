import { Incidents } from "./incidents";
import { Role } from "./role";

export class User {
    iNumber: string;
    name: string;
    key: string;
    isAvailable: boolean;
    incidents: Incidents;
    usagePercent: number;
    currentQDays: number;
    role: Role

    constructor(user) {
        this.iNumber = user.iNumber;
        this.name = user.name;
        this.key = user.key;
        this.isAvailable = user.isAvailable || false;
        this.incidents = user.incidents || new Incidents();
        this.role = user.role || new Role();
        this.currentQDays = user.currentQDays || 0;
        this.usagePercent = user.usagePercent || 1.0;
    }

    getStatus(): string {
        if (this.isAvailable) {
            return "OK"
        } else {
            return "BUSY"
        }
    }

    setStatus(bool: boolean): void {
        this.isAvailable = bool;
    }

    getIncidentTotal(): number {
        var total = 0;
        for (var key in this.incidents) {
            total += this.getIncidentAmount(key);
        }
        return total;
    }

    getUserRoles(): Array<string> {
        let list: Array<string> = [];
        Object.keys(this.role).forEach(el => {
            if (this.role[el] == true) {
                list.push(el);
            }
        })
        return list;
    }

    hasRole(role: string): boolean {
        let ref = this.role[role];
        return ref;
    }

    getRoleList() : Array<string> {
        let list: Array<string> = [];
        Object.keys(this.role).forEach(el => {
            list.push(el);
        })
        return list;
    }

    getIncidentAmount(type: string): number {
        return this.incidents[type]
    }

    getAverageQDay(): any {
        var avg;
        if (this.usagePercent && this.currentQDays) {
            avg = this.getIncidentTotal() / (this.usagePercent * this.currentQDays);
        } else {
            avg = 0;
        }
        return parseFloat(avg).toFixed(2);
    }
    // TODO should be moved out
    resetIncidents() {
        let tmp = new Incidents()
        for (const key in tmp) {
            if (tmp.hasOwnProperty(key)) {
                this.incidents[key] = 0;
            }
        }
    }
}

