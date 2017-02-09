import { Component, OnInit } from '@angular/core';
import { HttpCall } from '../../shared/pojo/httpCall';
import { HttpCallsServiceService } from '../../services/http-calls-service.service';

@Component({
  selector: 'app-ws-call-history',
  templateUrl: './ws-call-history.component.html',
  styleUrls: ['./ws-call-history.component.css']
})
export class WsCallHistoryComponent implements OnInit
{
  public static MAX_ARRAY_LEN:number = 9333;
  sortOrder:any = null;

  constructor(private httpCallsServiceService : HttpCallsServiceService)
  {

  }

  ngOnInit()
  {

  }

  getCallList() : Array<HttpCall>
  {
    let calls:Array<HttpCall> = Array.prototype.slice.call(this.httpCallsServiceService.getCalls());
    return this.sortArray(calls);
  }
  sortArray(calls:Array<HttpCall>) : Array<HttpCall>
  {
    while(calls.length > WsCallHistoryComponent.MAX_ARRAY_LEN)
    {
      //calls.shift();
      let eleCount2Remove:number = calls.length - WsCallHistoryComponent.MAX_ARRAY_LEN;
      calls.splice(0, eleCount2Remove);
    }

    if(!this.sortOrder)
    {
      return calls.reverse();  //=inplace operation
    }

    //event.field = Field to sort     //event.order = Sort order: 1 : -1
    calls.sort((a:HttpCall, b:HttpCall) =>
    {
      let f1 = a[this.sortOrder.field];
      let f2 = b[this.sortOrder.field];
      if ((typeof f1) === 'string')
      {
        let s1:string = String(f1);
        let s2:string = String(f2);
        return this.sortOrder.order > 0 ? s1.localeCompare(f2) : s2.localeCompare(f1);
      }
      else if ((typeof f1) === 'number')
      {
        let n1:number = Number(f1);
        let n2:number = Number(f2);
        return this.sortOrder.order > 0 ? (n1 - n2) : (n2 - n1);
      }
      else if ((typeof f1) === 'boolean')
      {
        let n1:number = Boolean(f1) === true ? 1 : 0;
        let n2:number = Boolean(f2) === true ? 1 : 0;
        return this.sortOrder.order > 0 ? (n1 - n2) : (n2 - n1);
      }
      
      console.log("cmp unknown type:'"+(typeof f1)+"' of the field:"+this.sortOrder.field);
      return 0;
    });

    return calls;
  }
  sort($event) : boolean
  {
    //event.field = Field to sort    //event.order = Sort order
    this.sortOrder = $event;
    return false;
  }
  getRecordIndex(httpCall:HttpCall) : number
  {
    let calls:Array<HttpCall> = this.httpCallsServiceService.getCalls();
    for(let i:number=0;i < calls.length;i++)
    {
      if(calls[i] === httpCall) return i;
    }
    console.log("WsCallHistoryComponent:getRecordIndex ERR: idx not found");
    return -1;
  }
  onRowSelect(call:HttpCall) : boolean
  {
    console.log("notimpl. selected call:"+call.id);
    return false;
  }
  getSumServerWork() : number
  {
    let sum:number=0;
    let calls:Array<HttpCall> = this.httpCallsServiceService.getCalls();
    for(let i:number=0;i < calls.length;i++)
    {
      sum += calls[i].time;
    }
    return sum;
  }
}
