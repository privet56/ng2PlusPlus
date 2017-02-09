import { Component, OnInit, ContentChildren, ViewChildren, ViewChild } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/core';
import { MsgService } from '../services/msg.service';
import { SearchFormLinesComponent } from './search-form-lines/search-form-lines.component';
import { CanDeactivate, RouterOutlet, Router } from '@angular/router';
import { CfgService } from '../services/cfg.service';
import { Hit } from '../shared/pojo/hit';
import { ResultlistComponent } from './resultlist/resultlist.component';
import { UnicoService } from '../services/unico.service';
import { QueryPart } from '../shared/pojo/querypart';
import { UXmlUtil } from '../shared/uXmlUtil';
import { UStrUtil } from '../shared/uStrUtil';
import { ResolvCounter } from '../shared/resolvCounter'; 

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
   host: {
     '[@routeAnimation]': 'true',
     '[style.display]': "'block'",
     //'[style.position]': "'absolute'"
   },
  animations: [
    trigger('routeAnimation', [
      state('*', style({transform: 'translateX(0)', opacity: 1})),
      transition('void => *', [
        style({transform: 'translateX(-100%)', opacity: 0}),
        animate(CfgService.routeAnimationLength)
      ]),
      transition('* => void', animate(CfgService.routeAnimationLength, style({transform: 'translateX(100%)', opacity: 0})))
    ])
  ]
})
export class SearchComponent implements OnInit//, CanReuse, OnReuse
{
  @ViewChild(SearchFormLinesComponent) lines: SearchFormLinesComponent;
  @ViewChild(ResultlistComponent) resultlistComponent: ResultlistComponent;

  constructor(private msgService : MsgService,
              private unicoService : UnicoService,
              private cfgService : CfgService)
  {

  }
  /*
  routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction)
  {
    return true;
  }
  routerOnReuse(next: ComponentInstruction, prev: ComponentInstruction)
  {
  }
  */
  ngOnInit()
  {
    
  }
  onAnalyze() : void
  {
    let queryParts : QueryPart[] = this.lines.getQuery();
    this.resultlistComponent.onAnalyze(queryParts, null, false, null);
  }
  onStoreFilterCriteria(fileDownload : HTMLAnchorElement) : void
  {
    let s2save = this.getQueryXML();

    fileDownload.href = "data:application/xml;charset=utf-8,"+s2save;
    fileDownload.click();

    this.msgService.inf('Message', 'The File is downloaded.');
  }
  onLoadFilterCriteria(fileUpload : HTMLInputElement) : void
  {
    let self = this;
    var reader = new FileReader();
    reader.onload = function(event:any)
    {
      let data:string = event.target.result;
      let queryParts:Array<QueryPart> = UXmlUtil.xml2QueryParts(data);
      let msg:string = self.lines.fill(queryParts);
      self.msgService.inf('Message', msg);
    };
    //reader.readAsArrayBuffer  //gets ArrayBuffer
    //reader.readAsDataURL      //gets base64-encoded val
    if(fileUpload.files && fileUpload.files.length)
      reader.readAsBinaryString(fileUpload.files[0]);
    else
      console.log("cancel");
  }
  canSearch() : boolean
  {
    //TODO: if(this.resultlistComponent.isSearching())return false;
    return (this.lines.getQuery().length > 0);
  }
  getQueryXML() : string
  {
      let r = this.lines.getQueryXML();
      return r;
  }
}
