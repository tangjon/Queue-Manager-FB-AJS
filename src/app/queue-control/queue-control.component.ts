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

  allUsers: Observable<any[]>;
  users: Observable<any[]>;

  id$: Observable<string>;
  paramId: string;
  totalIncidents: number;
  totalIncidentsCtx: number;
  _userListAll: Array<User>;
  _userListCtx: Array<User>;
  _userListBusy: Array<User>;
  _userListAvailable: Array<User>;

  constructor(public db: AngularFireDatabase, private route: ActivatedRoute, private router: Router, public userService: UserService) {
    // Get Param :id in url
    this.id$ = this.route.params.pluck('id');
    this.id$.subscribe(value => {
      this.paramId = value;

      userService.getUsers({}).subscribe(r => {
        this._userListAll = r;

        this._userListCtx = r.filter((t: User) => {
          return t.role[this.paramId] == true;
        });

        this._userListCtx.sort(
          function (a, b) {
            if (a.getAverageQDay() < b.getAverageQDay())
              return -1;
            if (a.getAverageQDay() > b.getAverageQDay())
              return 1;
            return 0;
          })

        this._userListAvailable = this._userListCtx.filter((t: User) => {
          return t.isAvailable == true;
        });
        this._userListBusy = this._userListCtx.filter((t: User) => {
          return t.isAvailable == false;
        });

        this.updateSummary();
      })
    });
  }

  ngOnInit(): void {

  }

  toggleStatus(user: User) {
    let index;
    let bool = user.isAvailable;
    user.setStatus(!bool);
    this.userService.updateUser(user).subscribe(r => {
      this.refreshLists();
    })
  }

  refreshLists() {

    this._userListCtx.sort(function (a, b) {
      if (a.getAverageQDay() < b.getAverageQDay())
        return -1;
      if (a.getAverageQDay() > b.getAverageQDay())
        return 1;
      return 0;
    })
    console.log(this._userListCtx);
    this._userListAvailable = this._userListCtx.filter(v => {
      return v.isAvailable == true;
    })
    this._userListBusy = this._userListCtx.filter(v => {
      return v.isAvailable == false;
    })
  }

  incIncidentAmount(user: User) {
    let amount = 1;
    this.userService.updateIncident(user, this.paramId, amount).subscribe(r => {
      this.updateSummary();
      this.refreshLists();
    })
  }

  decIncidentAmount(user) {
    let amount = -1;
    this.userService.updateIncident(user, this.paramId, amount).subscribe(r => {
      this.updateSummary();
      this.refreshLists();
    })
  }
  logIt(msg) {
    console.log(msg)
  }

  updateSummary() {
    let totalA = 0;
    this._userListAll.forEach(user => {
      totalA += user.getIncidentTotal();
    });
    this.totalIncidents = totalA;

    let totalB = 0;
    this._userListCtx.forEach(element => {
      totalB += element.incidents[this.paramId]
    });
    this.totalIncidentsCtx = totalB;
  }
}