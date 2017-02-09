import { Injectable, EventEmitter } from '@angular/core';
import { Message } from 'primeng/primeng';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class MsgService
{
  public msg = new	EventEmitter<Message>();
  constructor()
  {

  }
  public inf(summary:string, detail:string) : void
  {
    this.addMsg('info', summary, detail);
  }
  public warn(summary:string, detail:string) : void
  {
    this.addMsg('warn', summary, detail);
  }
  public error(summary:string, detail:string) : void
  {
    this.addMsg('error', summary, detail);
  }
  public addMsg(severity: string, summary:string, detail:string) : void
  {
    this.msg.emit({severity:severity, summary:summary, detail:detail});
  }
}
