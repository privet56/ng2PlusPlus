import { Injectable } from '@angular/core';

declare var window : any;

@Injectable()
export class CfgService
{
  public static routeAnimationLength : number = 200;
  public dummyText : string = "Lorem ipsum dolor sit amet, consectetur, adipisci velit. ";
  constructor()
  {
    let s : string = this.dummyText;
    while(this.dummyText.length < 199)
    {
      this.dummyText += s;
    }
  }

  public wsUseGET() : boolean
  {
    let url : string = window.location.hostname;
    /*
    console.log("hostname:"+window.location.hostname);    //localhost
    console.log("host:"+window.location.host);            //localhost:4200
    console.log("origin:"+window.location.origin);        //http://localhost:4200
    console.log("port:"+window.location.port);            //4200
    console.log("protocol:"+window.location.protocol);    //http:
    */

    if(window.location.hostname.indexOf('bplaced') > -1)
    {
      return true;
    }

    //if(window.location.hostname === "localhost")
    {
      if((window.location.port == 4200) || (window.location.port == 8080))
      {
        return true;
      }
    }
    return false;
  }
  public wsGetPath(functionName : string) : string
  {
    //if(window.location.hostname === "localhost")
    {
      if(this.wsUseGET())
      {
        return "srv/"+functionName+".xml";
      }
      if(window.location.port == 3037)
      {
        //=dev env on localhost, app of the silverlight client -> CORS is not yet working!
        //web service is on port 3047
        //http://localhost:3047/DataProviderService.svc?wsdl
        return window.location.protocol+"//"+window.location.hostname+":3047/DataProviderService.svc";
      }
    }
    return "../DataProviderService.svc";
    //return window.location.protocol+"//"+window.location.hostname+":"+window.location.port+"/DataProviderService.svc";
  }
}
