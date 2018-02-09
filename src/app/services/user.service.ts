import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable()
export class UserService {

  url: string = "https://qmdatabasep2000140239trial.hanatrial.ondemand.com/hana_hello/data.xsodata/table"
  userList: Array<User>;
  tmp: any;
  constructor(public db: AngularFireDatabase, public http: HttpClient) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain'
      })
    };

    // let obs = http.get(this.url, httpOptions).map(val => {
    //   this.tmp = val;
    //   return this.tmp.d.results; //ignore warning
    // })
    // obs.subscribe(resp => {
    //   console.log(resp);
    // })
  }

  getUsers(query): Observable<any[]> {
    var q = query || {};
    // Query Defined
    if (q.key) {
      if (q.value != null) {
        return this.db.list('users', ref => ref.orderByChild(q.key).equalTo(q.value)).valueChanges().map(el => {
          return el.map(user => { return new User(user) })
        })
      } else {
        return this.db.list('users', ref => ref.orderByChild(q.key)).valueChanges().map(el => {
          return el.map(user => { return new User(user) })
        })
      }
    } else { // No Query
      return this.db.list('users').valueChanges().map(el => {
        return el.map(user => { return new User(user) })
      })
    }
  }

  addUser(name: string, iNumber: string) {
    let newUser = new User({
      iNumber: iNumber,
      name: name,
      key: this.db.createPushId()
    })
    // console.log(newUser);
    this.db.object('users/' + newUser.key).set(newUser)

    // NEW
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'responseType' : 'text'
      })
    }
    this.http.post("https://qmdatabasep2000140239trial.hanatrial.ondemand.com/hana_hello/user.xsjs", newUser, httpOptions).subscribe(t => {
      console.log(t);
    })
  }

  updateUser(key: string, fName: string, iNumber: string, usage: number) {
    usage = +usage;
    this.db.list('users').update(key, {
      name: fName,
      iNumber: iNumber,
      usagePercent: usage
    });
  }

  deleteUser(key: string) {
    this.db.object('users/' + key).remove();
  }

  deleteEverything() {
    this.db.object('users').remove();
  }

  toggleRole(user: User, role: string) {
    let bool = user.hasRole(role);
    let ref = this.db.object('users/' + user.key + '/role/' + role);
    ref.set(!bool);
  }

  setAvailable(key, bool) {
    this.db.object('users/' + key + '/isAvailable').set(bool);
  }

  updateIncident(key: string, type: string, amount: number) {
    this.db.object('users/' + key + '/incidents/' + type).set(amount);
  }
  updateQueueDays(key: string, amount: number) {
    this.db.object('users/' + key + '/currentQDays').set(amount);
  }
}
