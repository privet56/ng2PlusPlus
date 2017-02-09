import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ElementRef, AfterViewInit, ViewChild, ContentChild } from '@angular/core';
import { SelectItem } from 'primeng/primeng'
import { SearchFormLine } from '../search.form.line';
import { QueryPart } from '../../shared/pojo/querypart';
import { QueryPartType } from '../../shared/pojo/queryparttype';
import { MsgService } from '../../services/msg.service';
import { DlgService } from '../../services/dlg.service';
import { StaticService } from '../../services/static.service';

@Component({
  selector: 'app-search-form-line',
  templateUrl: './search-form-line.component.html',
  styleUrls: ['./search-form-line.component.css']
})
export class SearchFormLineComponent implements OnInit, OnDestroy, AfterViewInit
{
  @Input() searchFormLine : SearchFormLine;

  @ViewChild('helpText') vhelpText :	ElementRef;

  types : SelectItem[] = new Array<SelectItem>();
  type: string = null;

  booleanOperator : string;

  @Output() typeChanged: EventEmitter<SearchFormLine> = new EventEmitter<SearchFormLine>();
  @Output() removeCalled: EventEmitter<SearchFormLine> = new EventEmitter<SearchFormLine>();

  values : SelectItem[] = new Array<SelectItem>();
  valuesSelected: string[] = new Array<string>();
  value: string = null;

  constructor(private dlgService : DlgService, private staticService : StaticService)
  {

  }

  public getBooleanOperators() : {value:string,label:string}[]
  {
    return this.searchFormLine.getBooleanOperators4Type(this.type);
  }

  public getSearchFormLine() : SearchFormLine
  {
    return this.searchFormLine;
  }

  ngOnInit()
  {
    { //fill member 'types'
      let types : QueryPartType[] = this.searchFormLine.getTypes();
      //this.types.push({label: '', value: ''});  //empty first item
      for(let i : number = 0; i < types.length; i++)
      {
        this.types.push({label: types[i].name, value: types[i].name});
      }
    }
  }
  ngAfterViewInit()
  {
    if(this.searchFormLine.getQueryPart())
    {
      this.type = this.searchFormLine.name4Field(this.searchFormLine.getQueryPart().field);
      this.onTypeChanged({value:this.type});
      if(this.values.length > 0)
      {
        this.valuesSelected.push(this.searchFormLine.getQueryPart().value);
      }
      else
      {
        this.value = this.searchFormLine.getQueryPart().value;
      }

      //TODO: handle and/OR/and-not
      this.booleanOperator = this.searchFormLine.getQueryPart().exclude ? "NOT" : "AND";

      this.searchFormLine.setQueryPart(null);
    }
  }
  onTypeChanged(event:any) : void
  {
    this.typeChanged.next(this.getSearchFormLine());
    this.value = null;
    this.valuesSelected = new Array<string>();
    this.values.splice(0,this.values.length);   //=do empty the array
    { //fill this.values with the values of the selected type
      let _types : QueryPartType[] = this.searchFormLine.getTypes();
      let typeFound = false;
      for(let itypes : number = 0; itypes < _types.length; itypes++)
      {
        if(_types[itypes].name === event.value)
        {
          this.booleanOperator = this.getBooleanOperators()[0].value;

          for(let ivalue : number = 0; ivalue < _types[itypes].values.length; ivalue++)
          {
            this.values.push({label: _types[itypes].values[ivalue].value, value: _types[itypes].values[ivalue].id});
          }
          typeFound = true;
          break;
        }
      }
      if(!typeFound)  //eg user entered manually something  //TODO: would be better to disallow manual edit!
      {
        console.log("!typeFound");
        this.type = null;
      }
    }
  }
  onValueChanged(event:any) : void
  {
    if(event && event.value && event.value.length)
    {
      this.valuesSelected = new Array<string>();
      for(let i:number=0;i<event.value.length;i++)
        this.valuesSelected.push(event.value[i]);
    }
    else
    {
      //edit changed...
    }
  }

  ngOnDestroy()
  {
    if(this.typeChanged)  this.typeChanged.unsubscribe();
    if(this.removeCalled) this.removeCalled.unsubscribe();

    this.searchFormLine = null;
    this.types = null;
    this.type = null;
    this.typeChanged = null;
    this.removeCalled = null;
    this.values = null;
    this.valuesSelected = null;
    this.value = null;
  }

  public onRemove() : void
  {
    this.removeCalled.next(this.getSearchFormLine());
    this.ngOnDestroy();
  }
  public onRemoveLater() : void
  {
    setTimeout(() =>
    {
      this.onRemove();

    }, 9);
  }
  public getQueryPart() : Array<QueryPart>
  {
    let r:QueryPart[] = new Array<QueryPart>();

    if(!this.type)
    {
      return r;
    }

    if((this.valuesSelected.length > 0) && this.value)
    {
      console.log("ERR:value & values!");
      return r;
    }
    let field:string = "";
    {
      let _types : QueryPartType[] = this.searchFormLine.getTypes();
      for(let itypes : number = 0; itypes < _types.length; itypes++)
      {
        if(_types[itypes].name === this.type)
        {
          field = _types[itypes].field;
        }
      }
      if(!field)
      {
        //can be a normal case if user manually entered something
        //console.log("ERR in UI + getQueryPart");
        return r;
      }
    }

    //TODO: handle and/OR/and-not
    let exclude : boolean = this.booleanOperator === "NOT";

    if(this.value)
    {
      exclude = false;  //fulltext cannot exclude
      r.push(new QueryPart(field,this.value, exclude));
    }
    for(let i:number=0;i<this.valuesSelected.length;i++)
    {
      //let exclude : boolean = this.booleanOperator === "NOT";
      r.push(new QueryPart(field,this.valuesSelected[i], exclude));
    }

    return r;
  }

  public onHelp() : boolean
  {
    this.staticService.get("help.search").then(fc =>
    {
      let header : string = "Help";
      this.dlgService.showDlgMsg(fc, header, null, null);
    });

    //let txt : string = this.vhelpText.nativeElement.innerHTML;
    //let header : string = "Help";
    //this.dlgService.showDlgMsg(txt, header, null, null);
    return false;
  }
}
