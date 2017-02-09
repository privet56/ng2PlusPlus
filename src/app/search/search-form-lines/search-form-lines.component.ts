import { Component, OnInit, ViewChildren, ContentChildren, QueryList } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { SearchFormLineComponent } from '../search-form-line/search-form-line.component';
import { SearchFormLine } from '../search.form.line';
import { ConfirmationService } from 'primeng/primeng';
import { trigger, state, style, transition, animate } from '@angular/core';
import { MsgService } from '../../services/msg.service';
import { UXmlUtil } from '../../shared/uXmlUtil';
import { QueryPart } from '../../shared/pojo/querypart';

//TODO: why is the animation not working?

@Component({
  selector: 'app-search-form-lines',
  templateUrl: './search-form-lines.component.html',
  styleUrls: ['./search-form-lines.component.css'],
  providers:[ SearchFormLine ],
   host: {
     '[@flyInOut]': 'true'
   },
  animations: [
  trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)'}),
      animate(100)
    ]),
    transition('* => void', [
      animate(100, style({transform: 'translateX(100%)'}))
    ])
  ])
]

})
export class SearchFormLinesComponent implements OnInit
{
  @ViewChildren(SearchFormLineComponent) vSearchFormLineComps : QueryList<SearchFormLineComponent>;

  //an attempt to make state persistent across navigation, does not work...
  //static _searchFormLines : SearchFormLine[] = [ new SearchFormLine() ];
  //searchFormLines = SearchFormLinesComponent._searchFormLines;

  searchFormLines : SearchFormLine[] = [ new SearchFormLine() ];

  constructor(private confirmationService: ConfirmationService, private msgService : MsgService)
  {

  }
  ngOnInit()
  {

  }
  onTypeChanged(event : SearchFormLine) : void
  {
    let lastEle : number = this.searchFormLines.length - 1;
    let lastSfl : SearchFormLine = this.searchFormLines[lastEle];

    if(event === lastSfl)
    {
       this.searchFormLines.push(new SearchFormLine());
    }
  }
  onRemove(event : SearchFormLine) : void
  {
    var i : number = this.searchFormLines.indexOf(event, 0);
    this.searchFormLines.splice(i, 1);
  }

  onClear() : void
  {
    let _self = this;
    this.confirmationService.confirm(
    {
        header: 'Question',
        message: 'Are you sure that you want to perform this action?\n\n\n\t(Press ESC to cancel)',
        accept: () =>
        {
            //_self.searchFormLines.splice(0,_self.searchFormLines.length-1);
            //_self.onRemove(_self.searchFormLines[1]); //would work! //would not cause any exception!

            //fix "Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'"
            let comps : SearchFormLineComponent[] = _self.vSearchFormLineComps.toArray();
            for(let i:number=0;i<comps.length - 1;i++)
            {
              comps[i].onRemoveLater();
            }

            _self.msgService.inf('Clear', 'Search Form cleared.');
        }
    });
  }
  public getQueryXML() : string
  {
    let allQueryParts : QueryPart[] = this.getQuery();
    let s:string = UXmlUtil.o2SearchXML(allQueryParts, null, false, null);
    return s;
  }
  public getQuery() : QueryPart[] 
  {
    let allQueryParts:QueryPart[] = new Array<QueryPart>();

    if(!this.vSearchFormLineComps)  //normal at initializing
      return allQueryParts;

    let comps : SearchFormLineComponent[] = this.vSearchFormLineComps.toArray();
    
    for(let i:number=0;i<comps.length;i++)
    {
      allQueryParts = allQueryParts.concat(comps[i].getQueryPart());
    }
    return allQueryParts;
  }
  public fill(queryParts:Array<QueryPart>):string
  {
    { //remove existing lines
      let comps : SearchFormLineComponent[] = this.vSearchFormLineComps.toArray();
      for(let i:number=0;i<comps.length - 1;i++)
      {
        comps[i].onRemove();
      }
    }
    for(let i:number=0;i<queryParts.length;i++)
    {
      this.searchFormLines.unshift(new SearchFormLine(queryParts[i]));
    }

    return ""+queryParts.length+" entries inserted.";
  }
}
