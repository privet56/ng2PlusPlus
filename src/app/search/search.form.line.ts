import { Component, OnInit, Optional } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { QueryPartType } from '../shared/pojo/queryparttype';
import { QueryPart } from '../shared/pojo/querypart';

export class SearchFormLine
{
  protected queryPart : QueryPart = null;
  protected types : Array<QueryPartType> = new Array<QueryPartType>();
  public static booleanOperators : {value:string,label:string}[] = [{value:"AND", label:"AND"}, {value:"OR", label:"OR"}, {value:"NOT", label:"AND NOT"}];

  constructor(@Optional() queryPart? : QueryPart)
  {
    //TODO: query DB for possible query part types & their values!?
    this.types.push(new QueryPartType('Search Term','FreeTextSearchCondition', false));
    this.types.push(new QueryPartType('Collaboration Status','CooperationStatusCondition', true).addValue(1000,'active').addValue(2000,'completed').addValue(3000, 'canceled'));

    this.queryPart = queryPart;
  }
  public getQueryPart() : QueryPart
  {
    return this.queryPart;
  }
  public setQueryPart(queryPart:QueryPart) : void
  {
    this.queryPart = queryPart;
  }  
  public getTypes() : QueryPartType[]
  {
    return this.types;
  }
  public name4Field(field:string):string
  {
      for(let itypes : number = 0; itypes < this.types.length; itypes++)
      {
        if(this.types[itypes].field === field)
        {
          return this.types[itypes].name;
        }
      }
      console.log("SearchFormLine:name4Field: !name4field:'"+field+"'");
      return null;
  }
  public getBooleanOperators4Type(type:string) : {value:string,label:string}[]
  {
      for(let itypes : number = 0; itypes < this.types.length; itypes++)
      {
        if(this.types[itypes].name === type)
        {
          if(this.types[itypes].excludeable)
            return SearchFormLine.booleanOperators;
          else
            return [SearchFormLine.booleanOperators[0]];
        }
      }
      return [];
  }
}
