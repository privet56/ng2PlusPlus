import { QueryList, ViewChildren, Component, OnInit, ContentChildren, AfterViewInit } from '@angular/core';
import { UStrUtil } from '../../../shared/uStrUtil';
import { UJsUtil } from '../../../shared/uJsUtil';
import { MsgService } from '../../../services/msg.service';
import { GraphComponent } from '../graph/graph.component';
import { ValueEmitter } from '../../../shared/ValueEmitter';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit, AfterViewInit
{
  @ViewChildren(GraphComponent) vGraphs : QueryList<GraphComponent>;
  public onDD : ValueEmitter<number> = new ValueEmitter<number>();

  public datas : Array<any> = new Array<any>();

  constructor(private msgService : MsgService)
  {

  }

  ngOnInit()
  {

  }

  ngAfterViewInit()
  {
    this.onDD.subscribe(() => this.onDrop());
  }

  public setGraphsData(datas : any) : void
  {
    let id:number = new Date().getTime();

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
        propVal["id"] = id++;
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
  public onDrop():void
  {
    let i2Drop:number  = -1;
    let iDropInFrontOf = -1;

    this.vGraphs.forEach((graph:GraphComponent, index:number) =>
    {
        if(graph.isDragged)
        {
          if(i2Drop > -1)
            console.log("graphs:onDrop WRN: several i2Drop("+i2Drop+")?");
          i2Drop = graph.datasIndex;
          graph.isDragged = false;
        }
        if(graph.isDropOver)
        {
          if(iDropInFrontOf > -1)
            console.log("graphs:onDrop WRN: several iDropInFrontOf("+iDropInFrontOf+")?");          
          iDropInFrontOf = graph.datasIndex;
          graph.isDropOver = false;
        }
    });
    if((i2Drop < 0) || (iDropInFrontOf < 0))
    {
        let summary:string = "Move";
        let detail:string = "Drag&Drop operation failed.";
        console.log("graphs:onDrop WRN: i2Drop("+i2Drop+") <> iDropInFrontOf("+iDropInFrontOf+")");
        this.msgService.inf(summary, detail);
        return;
    }

    //let data2Move = this.datas[i2Drop];
    console.log("graphs:onDrop INF: i2Drop("+i2Drop+") <> iDropInFrontOf("+iDropInFrontOf+")");
    this.datas.splice(iDropInFrontOf, 0, this.datas.splice(i2Drop, 1)[0]);
  }
}
