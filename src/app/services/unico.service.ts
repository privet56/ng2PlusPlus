import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { Hit } from '../shared/pojo/hit';
import { CfgService } from './cfg.service';
import { ValueEmitter } from '../shared/ValueEmitter';
import { UnicoSoapService } from './unico/UnicoSoap';
import { SoapService } from './soap/soap.service';
import { HttpCallsServiceService } from './http-calls-service.service';
import { HttpCall } from '../shared/pojo/httpCall';
import { UStrUtil } from '../shared/uStrUtil';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

//@named
function named(target: any, propertyKey: string, descriptor: PropertyDescriptor)
{
  //key = {real function name, eg. GetNewsEntries}
  //target = UnicoSoapService
  target[propertyKey].__functionName = propertyKey;
  descriptor["__functionName"] = propertyKey;
}

@Injectable()
export class UnicoService extends UnicoSoapService
{
  constructor(cfgService : CfgService, http : Http, httpCallsServiceService : HttpCallsServiceService)
  {
    super(cfgService, http, httpCallsServiceService);
  }

  @named
  public GetEventsEntries(topN : number) : Promise<any>
  {
    let functionName : string = "GetEventsEntries"; //TODO: find out function Name automatically 

    let r : any = this.cache[functionName];
    if (r)
    {
      return new Promise<any>(resolve => resolve(r));
    }

    
    let httpCall : HttpCall = this._loading(true, functionName);

    var parameters:{}[] = [];
    parameters['siem:topN'] = topN;

    let soapService : SoapService = this._callWS(functionName, parameters);

    let p : Promise<any> = new Promise<any>(resolve =>
    {
      soapService.jsoResponseHandler = (response:any, responseRaw:string) =>
      {
        //return the array of the NewsEntry's
        resolve(this._onRequestFinished(response[functionName+"Result"].NewsEntry, functionName, true/*doCache*/, httpCall, responseRaw));
      };
      let request:string = soapService.post(functionName, parameters, functionName+"Result");
      httpCall.request = request;
    });

    return p;
  }

  @named
  public GetNewsEntries(topN : number) : Promise<any>
  {
    let functionName : string = "GetNewsEntries";
    let r : any = this.cache[functionName];
    if (r)
    {
      return new Promise<any>(resolve => resolve(r));
    }

    let httpCall:HttpCall = this._loading(true, functionName);

    var parameters:{}[] = [];
    parameters['siem:topN'] = topN;

    let soapService : SoapService = this._callWS(functionName, parameters);

    let p : Promise<any> = new Promise<any>(resolve =>
    {
      soapService.jsoResponseHandler = (response:any, responseRaw:string) =>
      {
        //return the array of the NewsEntry's
        resolve(this._onRequestFinished(response.GetNewsEntriesResult.NewsEntry, functionName, true/*doCache*/, httpCall, responseRaw));
      };
      let request:string = soapService.post(functionName, parameters, functionName+"Result");
      httpCall.request = request;
    });

    return p;
  }

  @named
  public Log(activity:string, activityDetails:string, activityDetailsExtended:string) : Promise<any>
  {
    let functionName : string = "Log";
    /*let r : any = this.cache[functionName];   //DO NOT CACHE, call writes!
    if (r)
    { return new Promise<any>(resolve => resolve(r));
    }*/

    let httpCall:HttpCall = this._loading(true, functionName);

    var parameters:{}[] = [];
    parameters['siem:activity']         = UStrUtil.trunc(activity, 40, '');              //MAX 40 chars!
    parameters['siem:activityDetails']  = UStrUtil.trunc(activityDetails, 40, '');       //MAX 40 chars!
    parameters['siem:searchRequest']    = activityDetailsExtended;

    let soapService : SoapService = this._callWS(functionName, parameters);

    let p : Promise<any> = new Promise<any>(resolve =>
    {
      soapService.jsoResponseHandler = (response:any, responseRaw:string) =>
      {
        //return the array of the NewsEntry's
        resolve(this._onRequestFinished(response.LogResult, functionName, false/*doCache*/, httpCall, responseRaw));
      };
      let request:string = soapService.post(functionName, parameters, functionName+"Result");
      httpCall.request = request;
    });

    return p;
  }
  
  public search(query:any) : Promise<any>
  {
    let functionName : string = "GetCollaborationSearchHits";

    //don't cache!

    let httpCall:HttpCall = this._loading(true, functionName);

    var parameters:{}[] = [];
    //ATTENZIONE: order is important! 
    parameters['siem:xmlSearchRequest'] = query;
    parameters['siem:calculateFilterValues'] = false;
    parameters['siem:calculateReportResults'] = true; //->graph!    

    let soapService : SoapService = this._callWS(functionName, parameters);

    let p : Promise<any> = new Promise<any>(resolve =>
    {
      soapService.jsoResponseHandler = (response:any, responseRaw:string) =>
      {
        //let hits : any = response[functionName+"Result"].int;
        let fuResponse : any = response.GetCollaborationSearchHitsResponse;

        resolve(this._onRequestFinished(fuResponse, functionName, false/*doCache*/, httpCall, responseRaw));
      };
      let request:string = soapService.post(functionName, parameters, functionName+"Response");
      httpCall.request = request;
    });
    return p;
  }

  private static __GetCollaborationDetails:number=0;
  public GetCollaborationDetails(CollaborationId: number) : Promise<any>
  {
    let functionName : string = "GetCollaborationDetails";
    let cacheKey = functionName+":"+CollaborationId;
    let r : any = this.cache[cacheKey];
    if (r)
    {
      return new Promise<any>(resolve => resolve(r));
    }

    UnicoService.__GetCollaborationDetails++;


    let httpCall : HttpCall = this._loading(true, functionName);

    var parameters:{}[] = [];
    parameters['siem:collaborationID'] = CollaborationId;

    let soapService : SoapService = this._callWS(functionName, parameters);

    let p : Promise<any> = new Promise<any>(resolve =>
    {
      soapService.jsoResponseHandler = (response:any, responseRaw:string) =>
      {
        let r : any = response[functionName+"Result"];

        if(this.cfgService.wsUseGET())  //debug code
        {
          r["Title"] = ""+CollaborationId;
          r["SiemensBudget"] = Math.abs(CollaborationId - 1125);
        }

        resolve(this._onRequestFinished(r, cacheKey, true/*doCache*/, httpCall, responseRaw));
        UnicoService.__GetCollaborationDetails--;
        if(UnicoService.__GetCollaborationDetails > 19)
        {
          console.log("UnicoService.__GetCollaborationDetails: too much concurrent requests?...:"+UnicoService.__GetCollaborationDetails);
        }
      };
      let request:string = soapService.post(functionName, parameters, functionName+"Result");
      httpCall.request = request;
    });
    return p;
  }
    /* return this._callWS(functionName, '')
      .map((response : Response) =>
      {
        let t : string = response.text();
        this.cache[functionName] = t;
        return t;
      })
      .finally(() => { this._loading(false); })      
      .toPromise()
      .catch((err : any) => { return this._handleError(err, functionName, ''); });
    return new Promise<any>(resolve =>
    {
      setTimeout(() =>
      {
        r = {text_news:this.cfgService.dummyText,text_events:this.cfgService.dummyText};
        this.cache["getHomeTexts"] = r;
        resolve(r);
        this._loading(false);
      }, 1000);
    }); */  
}
