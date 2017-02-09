import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { Hit } from '../../shared/pojo/hit';
import { CfgService } from '../cfg.service';
import { ValueEmitter } from '../../shared/ValueEmitter';
import { SoapService } from '../soap/soap.service';
import { HttpCallsServiceService } from '../http-calls-service.service';
import { HttpCall } from '../../shared/pojo/httpCall';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

export class UnicoSoapService
{
  public loadingChange : ValueEmitter<number> = new ValueEmitter<number>();

  protected cache = {};

  protected cfgService : CfgService;
  protected http : Http;
  protected httpCallsServiceService : HttpCallsServiceService;

  constructor(cfgService : CfgService,
              http : Http,
              httpCallsServiceService : HttpCallsServiceService)
  {
      this.cfgService = cfgService;
      this.http = http;
      this.httpCallsServiceService = httpCallsServiceService;
      //this.loadingChange.debounceTime(333).distinctUntilChanged();    //TODO
  }
  protected _loading(bIncr : boolean, functionName:string) : HttpCall
  {
    let value : number = bIncr ? this.loadingChange.getValue()+1 : this.loadingChange.getValue()-1;
    this.loadingChange.emit(value);
    if(bIncr)
    {
      let httpCall:HttpCall = new HttpCall(functionName, null, false, new Date(), false);
      this.httpCallsServiceService.newCall(httpCall);
      return httpCall;
    }
    return null;
  }
  protected _getWSPath(functionName : string)
  {
    return this.cfgService.wsGetPath(functionName);
  }
  protected _callWS(functionName : string, parameters : {}[]) : SoapService
  {
    let wsPath : string = this._getWSPath(functionName);
    let soapService : SoapService = new SoapService(""/*servicePort*/, wsPath, "Siemens.UnicoPlus.Lib.DataProvider/IDataProvider"/*targetNameSpace*/, this.cfgService.wsUseGET());
    soapService.envelopeBuilder = this.envelopeBuilder;
    soapService.localNameMode = true;
    soapService.debug = false;
    return soapService;
  }
  protected _handleError__deactivated(err : any, functionName : string, body : any) : void
  {
      console.log("error calling '"+functionName+"':");
      console.log(err);
      //TODO: visualize error for the user?
  }
  protected _onRequestFinished(response : any, functionName : string, doCache : boolean, httpCall : HttpCall, responseRaw:string) : any
  {
    this._loading(false, functionName);
    let isError:boolean = (!response || (response instanceof Error));

    httpCall.response = responseRaw;
    httpCall.end = new Date();
    httpCall.isCached = doCache;
    httpCall.success = !isError;

    if(isError)
    {
      console.log("error in _onRequestFinished: !response for '"+functionName+"'   "+response);
      return null;
    }
    else
    {
      if(doCache)
        this.cache[functionName] = response;
    }
    return response;
  }
  protected static __counter : number = 1;
  protected envelopeBuilder(response: {}, method : string) : string
  {
    if(UnicoSoapService.__counter > 999)
       UnicoSoapService.__counter = 0;

          /*
           `    <a:RelatesTo u:Id="_`+(++UnicoSoapService.__counter)+`">
                     urn:uuid:04d386bf-f850-459e-918b-ad80f3d1e0`+(++UnicoSoapService.__counter)+`
                </a:RelatesTo>
                <a:To soap:mustUnderstand="0" u:Id="_`+(++UnicoSoapService.__counter)+`">
                   Siemens.UnicoPlus.Lib.DataProvider/IDataProvider/`+method+`
                </a:To>`;*/


    return `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:siem="Siemens.UnicoPlus.Lib.DataProvider">
              <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <AuthTicket xmlns="Siemens.UnicoPlus.Lib.DataProvider">
                  html5client
                </AuthTicket>
                <wsa:Action>Siemens.UnicoPlus.Lib.DataProvider/IDataProvider/`+method+`</wsa:Action>
              </soap:Header>
              <soap:Body>
                <siem:`+method+`>`+
                  response +
                `</siem:`+method+`>
              </soap:Body>
            </soap:Envelope>`;
    /*
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:siem="Siemens.UnicoPlus.Lib.DataProvider">
      <soap:Header>
        <AuthTicket xmlns="Siemens.UnicoPlus.Lib.DataProvider">
      html5client
        </AuthTicket>
      </soap:Header>
      <soap:Body>
          <siem:GetNewsEntries>
            <siem:topN>5</siem:topN>
          </siem:GetNewsEntries>
      </soap:Body>
    </soap:Envelope>
    */
  }
}
