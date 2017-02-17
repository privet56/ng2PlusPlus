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
  public onExcelExport($event, fileDownload : HTMLAnchorElement) : boolean
  {
    let replaceAllInStr = function(s:string, search:string, replacement:string) : string
    {
      {
        let i:number=0;
        while(s.indexOf(search) > -1)
        {
          i++;
          if(i > 999)
          {
            console.log("WsCallHistory:onExcelExport WRN 1 !replace(i:"+i+")'"+search+"' ==> '"+replacement+"'");
            break;
          }
          s = s.replace(search, replacement);
        }
      }

      if(s.indexOf(search) > -1)
      {
        s = s.replace(new RegExp(search, 'g'), replacement);
      }

      if(s.indexOf(search) > -1)
      {
        console.log("WsCallHistory:onExcelExport WRN 2 !replace '"+search+"' ==> '"+replacement+"'");
      }
      return s;
    };

    let sRecordSeparator  = "\n";
    let sCellSeparator    = ";";
    
    let toCSVCell = function(s:any, isNumber:boolean, isLast:boolean) : string
    {
      if(!isNumber)
      {
        s = replaceAllInStr(s, "\r\n"             , " ");
        s = replaceAllInStr(s, "\n"               , " ");
        s = replaceAllInStr(s, "\r"               , " ");
        s = replaceAllInStr(s, "\t"               , " ");
        s = replaceAllInStr(s, ","                , " ");
        s = replaceAllInStr(s, ";"                , " ");
        s = replaceAllInStr(s, sCellSeparator     , " "),
        s = replaceAllInStr(s, sRecordSeparator   , " ");
        s = replaceAllInStr(s, '"'                , "DOUBLEQUTOE");
        s = replaceAllInStr(s, "'"                , "SINGLEQUOTE");
        s = s.replace(/\s{2,}/g,' ');
      }

      let isLong:boolean = (!isNumber && (s.length > 19));

      if(isLong && (s.length > 32000))
      {
        s = String(s).substring(0, 32000)+"...";
      }

  	  return ((isLong ? '"'+s+'"' : s) + (isLast ? sRecordSeparator : sCellSeparator));
    };

    let calls:Array<HttpCall> = this.getCallList();
    let s = toCSVCell("ID"              , false, false)+  //0
            toCSVCell("Call Name"       , false, false)+  //1
            toCSVCell("OK?"             , false, false)+  //2
            toCSVCell("Time (ms)"       , false, false)+  //3
            toCSVCell("Request length"  , false, false)+  //4
            toCSVCell("Response length" , false, false)+  //5
            toCSVCell("Request"         , false, false)+  //6
            toCSVCell("Response"        , false, true);   //7

    for(let i:number=0;i<calls.length;i++)
    {
      let call:HttpCall = calls[i];
      let ok:string = call.end ? ''+call.success : 'running...';
      let time:number = call.end ? call.time : 0;

      s +=  toCSVCell(call.id           , true , false)+    //0
            toCSVCell(call.name         , false, false)+    //1
            toCSVCell(ok                , false, false)+    //2
            toCSVCell(time              , true , false)+    //3
            toCSVCell(call.requestlen   , true , false)+    //4
            toCSVCell(call.responselen  , true , false)+    //5
            toCSVCell(call.request      , false, false)+    //6
            toCSVCell(call.response     , false, true);     //7
    }

    let dobtoa:boolean = false;

    if(dobtoa)
    {
      s = btoa(s);          //btoa doesn't support \uFEFF
    }
    else
    {
      s = '\uFEFF'+s;       //magic for excel
      s = encodeURIComponent(s);
    }

    { //offer for open/download
      let mimetype:string = "text/csv";//"text/comma-separated-values";  //text/csv
      let enc:string = dobtoa ? ";base64" : "";
      let url:string = "data:"+mimetype+';charset=utf-8'+enc+','+s;

      fileDownload.href = url;    //TODO: IE looks for an ~'App' .!?
      fileDownload.click();
      //window.open(url);
    }

    return false;
  }
}
