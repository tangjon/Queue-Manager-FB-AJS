import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpParams } from '@angular/common/http/src/params';
import { Incidents } from '../model/incidents';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpErrorResponse } from '@angular/common/http/src/response';

@Injectable()
export class UserService {

  url: string = "https://qmdatabasep2000140239trial.hanatrial.ondemand.com/hana_hello/data.xsodata/table"
  userList: Array<User>;
  tmp: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  constructor(public db: AngularFireDatabase, public http: HttpClient) {

  }

  getUsers(query): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http.get("https://qmdatabasep2000140239trial.hanatrial.ondemand.com/hana_hello/user.xsjs", httpOptions)
      .map(r => {
        let arr = [];
        for (var el in r) {
          arr.push(new User(r[el]));
        }
        return arr;
      }).catch((err:HttpErrorResponse) => {
        return Observable.throw(err.message + ": Restart the database: https://account.hanatrial.ondemand.com/cockpit#/acc/p2000140239trial/dbs/qmdatabase/");
      })

  }

  addUser(name: string, iNumber: string) {
    // Create the user
    let newUser = new User({
      iNumber: iNumber,
      name: name,
      key: this.db.createPushId()
    })
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http.post("https://qmdatabasep2000140239trial.hanatrial.ondemand.com/hana_hello/user.xsjs", newUser, httpOptions)
      .map(r => {
        return new User(r);
      });
  }
  updateUser(user: User) {
    let url = 'https://qmdatabasep2000140239trial.hanatrial.ondemand.com/hana_hello/user.xsjs'
    return this.http.put(url, user, this.httpOptions);
  }


  deleteUser(key: string): Observable<any> {
    // this.db.object('users/' + key).remove();
    return this.http.delete("https://qmdatabasep2000140239trial.hanatrial.ondemand.com/hana_hello/user.xsjs?key=" + "'" + key + "'");
  }
  updateRole(user: User, role: string) {
    // Work Around Server Doesnt Accept Boolean must convert to strings...
    var tmp = {};
    for (var el in user.role) {
      tmp[el] = user.role[el].toString();
    }
    tmp[role] = (!user.hasRole(role)).toString();
    let url = this.generateUrl('role', user.key);
    return this.http.put(url, JSON.stringify(tmp), this.httpOptions);
  }

  updateIncident(user: User, type: string, amount: number) {
    let url = this.generateUrl('incidents', user.key);
    user.incidents[type] += amount;
    return this.http.put(url, user.incidents, this.httpOptions);
  }
  // DEPRICATED
  deleteEverything() {
    // this.db.object('users').remove();
  }

  private generateUrl(table: string, key: string): string {
    let base = 'https://qmdatabasep2000140239trial.hanatrial.ondemand.com/hana_hello/data.xsodata/'
    let url = base + table + "('" + key + "')";
    return url;
  }
}
