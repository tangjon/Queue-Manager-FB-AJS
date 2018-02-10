import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/pluck';
import { RouteReuseStrategy } from '@angular/router';
import { UserService } from '../services/user.service';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';


@Component({
  selector: 'app-queue-control',
  templateUrl: './queue-control.component.html',
  styleUrls: ['./queue-control.component.css']
})
export class QueueControlComponent implements OnInit {

  busyUsers: Observable<any[]>;
  users: Observable<any[]>;
  id$: Observable<string>;
  paramId: string;
  currentIncidents: number;
  totalIncidents: number;

  _userList: Array<User>;
  _userListBusy: Array<User>;
  _userListAvailable: Array<User>;


  currentUsers;
  allUsers;
  constructor(public db: AngularFireDatabase, private route: ActivatedRoute, private router: Router, public userService: UserService) {
    // Get Param :id in url
    this.id$ = this.route.params.pluck('id');
    this.id$.subscribe(value => {
      this.paramId = value;


      this.users = userService.getUsers({}).map(_el => _el.filter(el => el.role[this.paramId] == true)).map(
        (data) => {
          data.sort((a, b) => {
            return a.getAverageQDay() < b.getAverageQDay() ? -1 : 1;
          });
          return data;
        });

      this.users.subscribe(r => {
        this._userList = r;

        this._userListAvailable = r.filter(v => {
          return v.getStatus() == true;
        })
        this._userListBusy = r.filter(v => {
          return v.getStatus() == false;
        })


        // Calculate Total Incidents in this context
        this.currentIncidents = 0
        r.forEach(element => {
          this.currentIncidents += element.incidents[this.paramId]
        });

      });

      // Calculate Total Incidents
      userService.getUsers({}).subscribe((r: Array<User>) => {
        let total = 0;
        r.forEach(user => {
          total += user.getIncidentTotal()
        })
        this.totalIncidents = total;
      });

      // // Try sorting
      // this.users = userService.getUsers({}).map(_el => _el.filter(el => el.role[this.paramId] == true)).map(
      //   (data) => {
      //     data.sort((a, b) => {
      //       return a.getAverageQDay() < b.getAverageQDay() ? -1 : 1;
      //     });
      //     return data;
      //   });
    });
  }

  ngOnInit(): void {

  }

  toggleStatus(user: User) {
    let index;
    let bool = user.getStatus();
    index = this._userList.findIndex(x => x.key == user.key);
    this._userList[index].setStatus(!bool);
    this.refreshLists();
  }

  refreshLists() {
    this._userListAvailable = this._userList.filter(v => {
      return v.getStatus() == true;
    })
    this._userListBusy = this._userList.filter(v => {
      return v.getStatus() == false;
    })
  }

  incIncidentAmount(user: User) {
    let amount = 1;
    this.userService.updateIncident(user.key, this.paramId, this.getIncidentAmount(user) + amount)
  }

  decIncidentAmount(user) {
    let amount = 1;
    this.userService.updateIncident(user.key, this.paramId, this.getIncidentAmount(user) - amount)
  }
  // Get incident amount based on type
  getIncidentAmount(user: User) {
    return user.getIncidentAmount(this.paramId);
  }

  getIncidentTotal(user: User) {
    return user.getIncidentTotal();
  }

  calculateAverageQDay(user: User) {
    return user.getAverageQDay();
  }
  logIt(msg) {
    console.log(msg)
  }
}