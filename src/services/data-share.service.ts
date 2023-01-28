import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  //getter
  public show=new BehaviorSubject<boolean>(true);
  currentMessage=this.show.asObservable();

  public isUpdate=new BehaviorSubject<boolean>(true);
  receivedMessage=this.isUpdate.asObservable();

  public scheduleIdChanger=new BehaviorSubject<any>(0);
  scheduleIdChangerMessage=this.scheduleIdChanger.asObservable();

  public creatorIdChanger=new BehaviorSubject<any>(0);
  creatorIdChangerMessage=this.creatorIdChanger.asObservable();

  public searchUserId=new BehaviorSubject<any>(0);
  searchUserIdMessage=this.searchUserId.asObservable();

  constructor() { }

  //setter
  changeMessage(message:boolean){
    this.show.next(message)
    console.log("send Msg : "+message);
  }

  changeIsUpdateMessage(message:boolean){
    this.isUpdate.next(message);
    console.log("Data Share isUpdatable changes : ",message);
  }

  changeScheduleIdChangerMessage(message:any){
    this.scheduleIdChanger.next(message);
    console.log("Data Share schedule ID : ",message);
  }

  changeCreatorIdChangerMessage(message:any){
    this.creatorIdChanger.next(message);
    console.log("Data Share Creator ID : ",message);
  }

  changeSearchUserIdMessage(message:any){
    this.searchUserId.next(message);
    console.log("Change Search User Id : ",message);
  }
}
