import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-team-manager',
  templateUrl: './team-manager.component.html',
  styleUrls: ['./team-manager.component.css']
})
export class TeamManagerComponent {
  newUser: User;
  inputName: string;
  inputiNumber: string;
  showSpinner: boolean = true;
  itemsRef: AngularFireList<any>;
  users: Observable<any[]>;
  userList: Array<User>;
  constructor(public db: AngularFireDatabase, public userService: UserService) {
    // Get Users
    this.users = userService.getUsers({});
    this.users.subscribe(r => {
      this.showSpinner = false;
      this.userList = r;
    })
    // Start with clear form
    this.clearForm();
  }

  // TODO Create user model
  addUser(fName: string, iNumber: string) {
    if (fName && iNumber) {
      this.userService.addUser(fName, iNumber).subscribe((r: User) => {
        this.userList.push(r);
      })
      this.clearForm
    }
  }
  updateItem(user: User, fName: string, iNumber: string, usage: string) {
    if (user && fName && iNumber && usage) {
      let iUsage = parseFloat(usage);
      user.name = fName;
      user.iNumber = iNumber;
      user.usagePercent = iUsage;
      this.userService.updateUser(user).subscribe(r => { })
    }

  }
  deleteItem(key: string) {
    this.userService.deleteUser(key).subscribe(t => {
      if (t.flag) {
        this.userList = this.userList.filter(function (el) {
          return el.key !== key;
        })
      }
    })
  }
  deleteEverything() {
    this.userService.deleteEverything();
  }
  logIt(msg) {
    console.log(msg)
  }
  toggleRole(user: User, role: string) {
    this.userService.updateRole(user, role).subscribe(t => {
      user.role[role] = !user.hasRole(role);
    })
  }

  clearForm() {
    this.inputiNumber = "";
    this.inputName = "";
  }
}
