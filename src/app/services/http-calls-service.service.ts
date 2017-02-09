import { Injectable } from '@angular/core';
import { HttpCall } from '../shared/pojo/httpCall';

@Injectable()
export class HttpCallsServiceService
{
  protected httpCalls:Array<HttpCall> = new Array<HttpCall>();

  constructor()
  {

  }
  public newCall(httpCall:HttpCall)
  {
    this.httpCalls.push(httpCall);
    /*
    while(this.httpCalls.length > HttpCallsServiceService.MAX_ARRAY_LEN)
    {
      this.httpCalls.shift();
    }
    */
  }
  public getCalls() : Array<HttpCall>
  {
    //I do not copy the array and trust the caller to only read it
    return this.httpCalls;
  }
}
