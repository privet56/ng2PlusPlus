import { ViewChild, Component, OnInit } from '@angular/core';
import { MsgService } from '../../services/msg.service';
import { Hit } from '../../shared/pojo/hit';
import { UnicoService } from '../../services/unico.service';
import { QueryPart } from '../../shared/pojo/querypart';
import { ResolvCounter } from '../../shared/resolvCounter';
import { ResolvCounterSeq } from '../../shared/resolvCounterSeq';
import { UXmlUtil } from '../../shared/uXmlUtil';
import { GraphsComponent } from './graphs/graphs.component';  

@Component({
  selector: 'app-resultlist',
  templateUrl: './resultlist.component.html',
  styleUrls: ['./resultlist.component.css']
})
export class ResultlistComponent implements OnInit
{
  @ViewChild(GraphsComponent) graphsComponent: GraphsComponent;

  private hitsDesc : string = null;
  private hitResolvDesc : string = null;
  private hits : Array<Hit> = new Array<Hit>();
  private lastQueryParts : QueryPart[] = null;
  public showGraph : boolean = false;

  constructor(private msgService : MsgService,
              private unicoService : UnicoService)
  {

  }

  ngOnInit()
  {

  }
  public setResultList(hits : Array<Hit>, start:number) : void
  {
    this.hits = hits;

    let end:number = new Date().getTime();
    let diff:number = end - start;

    this.hitsDesc = this.hits.length + " hits found in "+diff+" ms.";
  }
  public onRowSelect($event:any)
  {
    this.msgService.inf($event.data.Title, $event.data.hitDetails.Abstract);
  }
  public sort($event:any)
  {
    if(this.hits.length < 2)
    {
      return;
    }

    //$event.field = Field to sort   eg "id"
    //$event.order = Sort order      eg 1 or -1

    let sortAsc : boolean   = ($event.order > 0);

    if(this.hitResolvDesc != null)  // = all hits are resolved
    {
      this.sortHitsInMemory($event.field, sortAsc);
      return;
    }

    let filter:{name:string,value:string}[]   = null; //TODO: get filter
    this.onAnalyze(null, $event.field, sortAsc, filter);

    return false;
  }
  public sortHitsInMemory(fieldName:string, sortAsc:boolean) : void
  {
    this.hits.sort((a:Hit, b:Hit) =>
    {
      let f1 = a[fieldName];  //TODO impl for nested attrs, like SiemensContacts.SiemensContact.Name + FirstName
      let f2 = b[fieldName];
      if ((typeof f1) === 'string')
      {
        let s1:string = String(f1);
        let s2:string = String(f2);
        return sortAsc ? s1.localeCompare(f2) : s2.localeCompare(f1);
      }
      if ((typeof f1) === 'number')
      {
        let n1:number = Number(f1);
        let n2:number = Number(f2);
        return sortAsc ? (n1 - n2) : (n2 - n1);
      }
      console.log("cmp unknown type:'"+(typeof f1)+"' of the field:"+fieldName);
      return 0;
    });

  }
  public filter($event:any)
  {
    console.log("FILTER: //TODO: how to get it called?");
    console.log($event);
  }
  public onResolvCompletion(hitCount : number, timeInMs: number) : void
  {
    if(hitCount < 0)
    {
      this.hitResolvDesc = null;
      return;
    }
    let time : string = ""+timeInMs + " ms";
    if(timeInMs > 5555)
        time = ""+(timeInMs/1000) + " sec";
    if(hitCount < 1)
      this.hitResolvDesc = "No hits.";
    else
      this.hitResolvDesc = "" +hitCount+ " hits resolved in " + time; 
  }

  //TODO: there can be more filters!
  public onAnalyze(queryParts : QueryPart[], sort:string, sortAsc: boolean, filter:{name:string,value:string}[]) : void
  {
    let start:number = new Date().getTime();
    { //reset sort+filter
      this.onResolvCompletion(-1,-1);
      //TODO: how to reset sort+filter of the dataTable?
    }
    queryParts = queryParts ? queryParts : this.lastQueryParts;
    this.lastQueryParts = queryParts;
    let queryXML:string = UXmlUtil.o2SearchXML(queryParts, sort, sortAsc, filter);

    console.log(queryXML);
    
    this.unicoService.search(queryXML).then(GetCollaborationSearchHitsResponse =>
    {
      let hitIds = GetCollaborationSearchHitsResponse.GetCollaborationSearchHitsResult.int;

      this.graphsComponent.setGraphsData(GetCollaborationSearchHitsResponse.reportingResults);

      let hits : Array<Hit> = new Array<Hit>();

      if(hitIds/*.$*/ && ((typeof hitIds) === 'string'))   //hits.len == 1
      {
        hits.push(new Hit(hitIds, this.unicoService));
      }
      else if(hitIds && hitIds.length)   //hits.len > 1
      {
        for(let i : number = 0;i < hitIds.length;i++)
        {
            hits.push(new Hit(hitIds[i], this.unicoService));
        }
      }
      else
      {
        console.log("unexepcted result:"+hitIds);
      }

      //resolve all hits to be able to sort the result table!   :-(
      //not needed to to read all hits as the table will do that automatically when sorting :-)
      //sortable fields have to be set up as eg. hit.getSiemensBudget() {resolve();return hitDetails.SiemensBudget;}
      //^ not true!!!
      if(hits.length > 0)
      {
        if(hits.length < 111)
        {
          console.log("resolveAllHits. hits#:"+hits.length);
          let resolvCounter : ResolvCounter = new ResolvCounterSeq(hits, (hitCount, timeInMs) =>
          {
            return (this.onResolvCompletion(hitCount, timeInMs));
          });
        }
        else
        {
          console.log("!resolveAllHits, because too much hits("+hits.length+"):");
        }

        //eg: 2767 hits RESOLVED in 302869 ms = 302 seconds = 5.033^ min => sort on the server side!
      }
      else
      {
        this.onResolvCompletion(0, 0);
      }

      this.setResultList(hits, start);

      this.showGraph = (hits.length > 2); //TODO: do it with animation

    });
  }
  public onShowGraph($event:any) : void
  {

  }

  data: any = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        }  
}
