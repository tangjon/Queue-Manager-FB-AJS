import { Injectable } from '@angular/core';
import { ActivityBook } from '../model/activitybook';
import { EntryLog } from '../model/entrylog';
import { User } from '../model/user';
import { Role } from '../model/role';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { QmUser } from '../model/qmuser';

@Injectable()
export class ActivityBookService {

  private activityBook: ActivityBook = new ActivityBook();
  url: string = "https://qmdatabasep2000140239trial.hanatrial.ondemand.com/hana_hello/data.xsodata/activity_log"
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }
  constructor(public db: AngularFireDatabase, public http: HttpClient) {

  }

  getBook() {
    return this.http.get(this.url + "?$format=json", this.httpOptions)
      .map((r: any) => {
        let t = r.d.results.map(t => {
          let tmp = new EntryLog(t.NAME, t.INUMBER, t.ACTION, t.DESCRIPTION, new QmUser(t.MANAGER), t.PUSH_ID)
          tmp.setDateFromString(t.DATE)
          return tmp;
        }
        )
        t.forEach((el: EntryLog) => {
          this.activityBook.logEntry(el);
        });
        return this.activityBook;
      })
  }

  getManager() {
    return this.activityBook.getQmUser();
  }
  updateManager(name: string) {
    this.activityBook.setQM(name);
  }

  logIncident(user: User, type: string, amount: number) {
    this.logEntry(user,
      "Incident Modified",
      user.getIncidentAmount(type) + " to " + (user.getIncidentAmount(type) + amount) + " in " + type);
  }

  logRole(user: User, role) {
    let action = "";
    if (user.hasRole(role)) {
      action = "Unassigned"

    } else {
      action = "Assigned"
    }
    this.logEntry(user, "Role Changed", action + " " + role)
  }

  logUser(user) {
    this.logEntry(user, "User Updated", user.name + "'s credential have been updated")
  }

  logEntry(user, action, description) {
    let pushId = this.db.createPushId();
    let entry = new EntryLog(
      user.name, user.iNumber,
      action, description, this.activityBook.getQmUser(),
      pushId
    );
    console.log(entry);
    let body = {
      "PUSH_ID": pushId,
      "ACTION": action,
      "MANAGER": entry.getManager().name,
      "DATE": JSON.stringify(entry.getFullDate()),
      "DESCRIPTION": description,
      "NAME": user.name,
      "INUMBER": user.iNumber
    }
    this.http.post(this.url, body, this.httpOptions)
      .subscribe(t => {
        console.log(entry);
        this.activityBook.logEntry(entry);
      });
  }

  resetLogs(){
    let logRef = this.activityBook.getLogs();
    logRef.forEach((el:EntryLog) => {
      this.http.delete(gDeleteUrl(el.pushID)).subscribe(r=>{
        this.activityBook.removeLog(el.pushID);
      })
    });

    function gDeleteUrl(key){
      let url: string = "https://qmdatabasep2000140239trial.hanatrial.ondemand.com/hana_hello/data.xsodata/activity_log"
      return url + "('" + key + "')";
    }
  }



}
