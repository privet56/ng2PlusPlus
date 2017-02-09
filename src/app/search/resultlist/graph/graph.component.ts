import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UStrUtil } from '../../../shared/uStrUtil';
import { UJsUtil } from '../../../shared/uJsUtil';
import { MsgService } from '../../../services/msg.service';

/*
  <c:ReportingRecordCollaborationType>
    <b:BudgetForCollaborationPartner>0</b:BudgetForCollaborationPartner>
    <b:NumberOfCollaborations>3</b:NumberOfCollaborations>
    <b:ViewBudgetNotAllowed>3</b:ViewBudgetNotAllowed>
    <c:CollaborationType>Total</c:CollaborationType>
  </c:ReportingRecordCollaborationType>
  <c:ReportingRecordCollaborationType>
    <b:BudgetForCollaborationPartner>0</b:BudgetForCollaborationPartner>
    <b:NumberOfCollaborations>3</b:NumberOfCollaborations>
    <b:ViewBudgetNotAllowed>3</b:ViewBudgetNotAllowed>
    <c:CollaborationType>Sponsorings / Donations / Other contributions</c:CollaborationType>
  </c:ReportingRecordCollaborationType>
*/

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit
{
  //TODO: more colors & different(?) hoverBackgroundColor
  public static __backgroundColors : Array<string> = [
    "#FF6384","#4BC0C0","#FFCE56","#E7E9ED","#36A2EB",
    "#84FF63","#C04BC0","#56FFCE","#EDE7E9","#EB36A2"
  ];

  @ViewChild('chart') vChart :	ElementRef;
  @Input() data : any = { };
  @Input() datasIndex : number = -1;

  public total:number = 0;

  constructor(private msgService : MsgService)
  {
    /* data demo: 
    this.data = {
      labels: ['A','B','C'],
      datasets: [
          {
              data: [300, 50, 100],
              backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ]
          }]    
      };
    */
  }

  ngOnInit()
  {

  }

  public getOptions() : any
  {
      return {
          title: {
              display: false,
              text: 'Chart',
              fontSize: 16
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
                fontColor: 'black'//#990000'//rgb(255, 99, 132)'
            }
          },
          animation: {
            animateScale:true,
            animateRotate:true
          },
          elements: {
            arc: {
                borderColor: "#FFFFFF"
            }
          },
          cutoutPercentage: 11
      };
  }

  public onDataSelected($event:any) : void
  {
    //(onDataSelect)="onDataSelected($event)"

    //TODO: EXCEPTION: Error in ./UIChart class UIChart - inline template:2:12 caused by: Cannot read property 'intersect' of undefined
    // https://github.com/chartjs/Chart.js/issues/3603    getDatasetAtEvent & getElementsForDataset 

    //$event.dataset = Selected dataset
    //$event.element = Selected element
    //$event.element._datasetIndex = Index of the dataset in data
    //$event.element_index = Index of the data in dataset

    console.log($event);

    let summary:string = $event.dataset+" "+$event.element;
    let detail:string = $event.element._datasetIndex+" "+$event.element_index;

    this.msgService.inf(summary, detail);
  }

  public getCharData() : any
  {
    let data = {};
    let labels:Array<string> = new Array<string>();
    let datasets:Array<any> = new Array<any>();
    let datasets_data : Array<number> = new Array<number>();
    let datasets_backgroundColor : Array<string> = new Array<string>();
    let datasets_hoverBackgroundColor : Array<string> = new Array<string>();
    this.fillData(labels, datasets_data, datasets_backgroundColor, datasets_hoverBackgroundColor);
    datasets[0] = {
      data:datasets_data,
      backgroundColor:datasets_backgroundColor,
      hoverBackgroundColor:datasets_hoverBackgroundColor
    };
    data['labels'] = labels;
    data['datasets'] = datasets;    
    return data;
  }
  private getClearName(s:string) : string
  {
    if(!s)return s;
    let a:Array<string> = s.split(/(?=[A-Z])/);//.match(/[A-Z][a-z]+/g);
    if(!a)return s;
    for(let i:number=0;i<a.length;i++)
    {
      if((a[i].toLowerCase() == 'reporting') ||
         (a[i].toLowerCase() == 'record') ||
         (a[i].toLowerCase() == 'siemens'))
      {
        a[i] = ' ';
      }
    }
    let r:string = "";//a.join(' ').trim();
    for(let i:number=0;i<a.length;i++)          //'B U' -> 'BU'
    {
      let sep:string = " ";
      if((a[i].length === 1) && (i > 0) && (a[i-1].length === 1))
      {
        sep = "";
      }
      r += sep + a[i];
    }
    r = r.trim();
    if(r.length < 1)
      return s;

    //r = r.replace(/\\b(\\w)\\s+(\\w)\\b/g, "$1$2");   //why does it not work?

    return r;
  }
  public getTitle() : string
  {
    for(let propName in this.data)
    {
      let propVal:any = this.data[propName];
      if(Array.isArray(propVal))
      {
        return this.getClearName(propName);
      }
    }
    this.loge("!getTitle ERR arrayNotFound", this.data);
    return "[unnnamed]";
  }
  private getDatas() : Array<any>
  {
    let i:number=-1;
    for(let propName in this.data)
    {
      i++;
      let propVal:any = this.data[propName];
      if(Array.isArray(propVal))
      {
        return propVal;
      }
    }
    this.loge("!getDatas ERR arrayNotFoundi:"+i, this.data);
    return new Array<any>();
  }
  private fillData(labels:Array<string>, datasets_data:Array<number>, datasets_backgroundColor:Array<string>, datasets_hoverBackgroundColor:Array<string>) : void
  {
    let index:number = -1;
    let datas:Array<any> = this.getDatas();
    let rest:number = 0;
    //for(let propName in this.data)
    for(let i:number=0;i<datas.length;i++)
    {
      index++;
      let propVal:any           = datas[i];
      if(this.isTotal(propVal))
      {
        this.total = this.getChildVal4Prefix(propVal, "NumberOf");
        continue;
      }

      let label:string          = this.getLabel(propVal);
      let datapoint:number      = this.getChildVal4Prefix(propVal, "NumberOf");
      let backgroundColor:string= GraphComponent.__backgroundColors[index % GraphComponent.__backgroundColors.length];

      if(labels.length > 4)
      { //assumption: 'datas' is sorted!
        rest += datapoint;
        if(datapoint > datasets_data[datasets_data.length - 1])
        {
          this.loge("graph:fillData ERR: not sorted results? index:"+index+", datapoint:"+datapoint+" higherdatapoint:"+datasets_data[datasets_data.length - 1] , this.data);
        }  
        continue;
      }

      labels.push(label);
      datasets_data.push(datapoint);
      datasets_backgroundColor.push(backgroundColor);
      datasets_hoverBackgroundColor.push(backgroundColor);
    }
    if(labels.length < 1)
    {
      this.loge("graph:fillData WRN: !enoughData (index:"+index+")", this.data);
    }
    if(rest > 0)
    {
      labels.push("Rest ("+(datas.length - labels.length)+" entries)");
      datasets_data.push(rest);
      let backgroundColor:string = GraphComponent.__backgroundColors[GraphComponent.__backgroundColors.length-1];
      datasets_backgroundColor.push(backgroundColor);
      datasets_hoverBackgroundColor.push(backgroundColor);
    }
  }
  private isTotal(o:any) : boolean
  {
    for(let propName in o)
    {
      let sPropVal:string = o[propName];
      let isTotal:boolean = (sPropVal === 'Total');
      if(isTotal && (this.getTitle() === this.getClearName(propName)))
      {
        return true;
      }
    }
    return false;
  }

  private getChildVal4Prefix(o:any, prefix:string) : number
  {
    prefix = prefix.toLowerCase();
    for(let propName in o)
    {
      if(!propName.toLowerCase().startsWith(prefix))continue;
      let sPropVal:string = o[propName];
      let iPropVal:number = parseInt(sPropVal);
      if(Number.isNaN(iPropVal))
      {
        this.loge("graph:getChildVal4Prefix ERR: NaN prefix:'"+prefix+"' prop:"+propName+":"+sPropVal+"", o);
        continue;
      }
      return iPropVal;
    }
    this.loge("graph:getChildVal4Prefix ERR: notFound prefix:'"+prefix+"'", o);
    return 0;
  }

  private getLabel(o:any) : string
  {
    let label:string = "";
    for(let propName in o)
    {
        let propVal:any = o[propName];
        propVal = propVal.trim();
        if(!propVal || propVal.length < 1)
          continue;
        if(propVal === '---')continue;
        //if(propVal === 'undefined')continue;
        if(UStrUtil.isNummericString(propVal, ".,", true))continue;
        let propNameClear:string  = this.getClearName(propName);
        let div:string    = ': ';
        if(propNameClear === this.getTitle())
        {
          propNameClear = '';
          div = '';
        }
        label += (label === "" ? "" : ", ") + propNameClear + div + propVal;
    }

    if(!label || (label.length < 2) || ((typeof label) !== 'string'))
    {
      this.loge("graph:getLabel ERR: labelNotFound (type:'"+(typeof label)+"', len:"+label.length+"):'"+label+"'", o);
      return label;
    }
    let r:string = label.substring(0, 33);
    if(r !== label)
      r = r + "...";
    return r;
  }

  private static __loggedE = -1
  private loge(s:string, o:any) : void
  {
    if(GraphComponent.__loggedE++ > 99)return;
    console.log(this.datasIndex+":"+s);
    console.log(o);
  }

  public onPDF(div: HTMLDivElement) : boolean
  {
    var fn = 'graph-'+this.getTitle()+'.pdf';
    UJsUtil.doPDF(div, fn, false);
    return false;
  }
}
