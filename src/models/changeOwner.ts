export class changeOwner{
    constructor(
         public scheduleId:number,
         public currentUserId:number,
         public userId:number, 
         public ownerId:number,
         public isDelete:Boolean
    ){}
}