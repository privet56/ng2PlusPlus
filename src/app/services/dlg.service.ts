import { Injectable, EventEmitter } from '@angular/core';
import { Message } from 'primeng/primeng';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class DlgService
{
  public dlgMsg = new	EventEmitter();

  constructor()
  {

  }
  public showDlgMsg(content:string,header:string,footer:string, attrs:any) : void
  {
    this.dlgMsg.emit({content:content, header:header, footer:footer, attrs:attrs});
  }
}
