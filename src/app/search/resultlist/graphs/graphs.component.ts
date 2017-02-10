import { Component, OnInit } from '@angular/core';
import { UStrUtil } from '../../../shared/uStrUtil';
import { UJsUtil } from '../../../shared/uJsUtil';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit
{
  public datas : Array<any> = new Array<any>();

  constructor()
  {

  }

  ngOnInit()
  {

  }

  public setGraphsData(datas : any) : void
  {
    this.datas = new Array<any>();
    for(let propName in datas)
    {
      if(!propName.length || (propName.length < 3)) //eg '_'
      {
        continue;
      }
      let propVal:any = datas[propName];
      if((typeof propVal) === 'object')
      {
        this.datas.push(propVal);
      }
      else
      {
        console.log("graphs: WRN skipped("+(typeof propVal)+"): "+propName+"="+propVal);
      }
    }
  }
  public onPDF(div: HTMLDivElement) : boolean
  {
    var fn = 'collaboration-distribution.pdf';
    UJsUtil.doPDF(div, fn, true);
    return false;
  }
//d&d
  public dragStart($event,data):void
  {
    console.log("graphs:dragStart");
  }
  public dragEnd($event):void
  {
    console.log("graphs:dragEnd");
  }
  public drop(event):void
  {
    console.log("graphs:drop");    
  }
}
