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

  itemsRef: AngularFireList<any>;
  users: Observable<any[]>;
  userList: Array<User>;
  constructor(public db: AngularFireDatabase, public userService: UserService) {
    // Get Users
    this.users = userService.getUsers({});
    this.users.subscribe(r => {
      this.userList = r;
    })
    // Start with clear form
    this.clearForm();
  }

  // TODO Create user model
  addUser(fName: string, iNumber: string) {
    if (fName && iNumber) {
      this.userService.addUser(fName, iNumber).subscribe((r:User) => {
        this.userList.push(r);
      })
 
    }
  }
  clearForm(){
    this.inputiNumber = "";
    this.inputName = "";
  }
  updateItem(key: string, fName: string, iNumber: string, usage: number) {
    this.userService.updateUser(key, fName, iNumber, usage);
  }
  deleteItem(key: string) {
    this.userService.deleteUser(key).subscribe(t => {
      if(t.flag){
        this.userList = this.userList.filter( function(el) {
          return el.key !== key;
        })
        
      }
      console.log(t);
    })
  }
  deleteEverything() {
    this.userService.deleteEverything();
  }
  logIt(msg) {
    console.log(msg)
  }
  toggleRole(user: User, role: string) {
    this.userService.toggleRole(user, role);
  }

}
