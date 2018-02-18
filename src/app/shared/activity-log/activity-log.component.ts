import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { EntryLog } from '../../model/entrylog';
import { ActivityBook } from '../../model/activitybook';
import { ActivityBookService } from '../../services/activity-book.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {

  constructor(public userService: UserService, public activityBookSerivce : ActivityBookService) {
   }
  
  activityBook : ActivityBook;
  activityLog: Array<EntryLog>;
  activityLogOld : any;
  ngOnInit() {
    // this.activityLog = this.activityBookSerivce.getBook().getLogs();
    this.activityBookSerivce.getBook().subscribe((r:ActivityBook)=>{
      this.activityLog = r.getLogs();
    })
  }

  logIt(obj){
    console.log(obj);
  }

  resetLogs(){
    this.activityBookSerivce.resetLogs();
  }

}
