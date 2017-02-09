import { Injectable, Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { MsgService } from '../../services/msg.service';

@Component({
  selector: 'app-msgs',
  templateUrl: './msgs.component.html',
  styleUrls: ['./msgs.component.css']
})

export class MsgsComponent implements OnInit
{
  public delOneByOne : boolean = true;
  msgs: any[] = [];
  wideMsgs: any[] = [];

  constructor(private msgService : MsgService)
  {

  }

  ngOnInit()
  {
    this.msgService.msg.subscribe((msg:any) => {
      msg.timestamp = new Date();
      if(msg.severity === 'error')
        this.wideMsgs.push(msg);
      else
        this.msgs.push(msg);
    });
     
    {
      setInterval(() =>
      {
        let d:Date = new Date();
        d.setSeconds(d.getSeconds() - 15);
        if(this.delOneByOne)
        {
          for(let i:number=0;i<this.wideMsgs.length;i++)
          {
            if(this.wideMsgs[i].timestamp < d)
            {
              this.wideMsgs.splice(i, 1);
              return;
            }
          }
        }
        else
        {
          for(let i:number=this.wideMsgs.length-1;i>-1;i--)
          {
            if(this.wideMsgs[i].timestamp < d)
            {
              this.wideMsgs.splice(i, 1);
            }
          }
        }
      
      }, 1000);
    }
  }
}
