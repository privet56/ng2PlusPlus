import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { DlgService } from './dlg.service';
import { HttpCallsServiceService } from './http-calls-service.service';
import { HttpCall } from '../shared/pojo/httpCall';

@Injectable()
export class StaticService
{
  protected cache = {};

  constructor(protected http : Http, private dlgService : DlgService, private httpCallsServiceService : HttpCallsServiceService)
  {

  }
  public show(fn:string, title:string) : void
  {
    this.get(fn).then(fc =>
    {
      let header : string = title;
      fc = fc.replace(/\n/g, "<br>").replace(/  /g, "&nbsp;&nbsp;");
      this.dlgService.showDlgMsg(fc, header, null, null);
    });
  }
  public get(fn:string) : Promise<any>
  {
    let r : string = this.cache[fn];
    if (r)
    {
      return new Promise<any>(resolve => resolve(r));
    }

    let httpCall:HttpCall = new HttpCall(fn, null, false, new Date(), false);
    this.httpCallsServiceService.newCall(httpCall);

    let request:string = "assets/static/"+fn+".html";
    httpCall.request = request; 

    return this.http.get(request).map(res =>
    {
      let txt = res.text();
      this.cache[fn] = txt;

      httpCall.response = txt;
      httpCall.end = new Date();
      httpCall.isCached = true;
      httpCall.success = true;

      return txt;
    })
    .toPromise()
    .catch((err:any) =>
    {
      console.log("staticService: ERR: catch:"+err);
      console.log(err);

      httpCall.response = err;
      httpCall.end = new Date();
      httpCall.isCached = true;
      httpCall.success = false;

      return Promise.reject(err);
    });
  }
}
