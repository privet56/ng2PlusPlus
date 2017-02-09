import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { QueryPart } from './pojo/querypart';
import { UStrUtil } from './uStrUtil';

export class UXmlUtil
{
/*
<SortCondition><AttributeName>CollaborationTitle</AttributeName><Ascending>1</Ascending></SortCondition>
<SortCondition><AttributeName>CollaborationId</AttributeName><Ascending>1</Ascending></SortCondition>
<SortCondition><AttributeName>Budget</AttributeName><Ascending>1</Ascending></SortCondition>
<SortCondition><AttributeName>Budget</AttributeName><Ascending>0</Ascending></SortCondition>

<FilterCondition>
	<SiemensSectorID>631</SiemensSectorID>
	<SiemensDivisionID></SiemensDivisionID>
	<SiemensBUID></SiemensBUID>
	<FirstSiemensContactTitle></FirstSiemensContactTitle>
	<FirstSiemensContactFirstName></FirstSiemensContactFirstName>
	<FirstSiemensContactLastName></FirstSiemensContactLastName>
	<FirstResearchAreaID></FirstResearchAreaID>
	<FirstInstitutionID></FirstInstitutionID>
	<FirstInstitutionContactID></FirstInstitutionContactID>
	<CooperationTypeID></CooperationTypeID>
</FilterCondition>
*/
    public static xml2QueryParts(xmlstr:string) : Array<QueryPart>
    {
        var oParser = new DOMParser();
        var xmlDoc = oParser.parseFromString(xmlstr, 'text/xml');
        var xmlDocRoot  = xmlDoc.getElementsByTagName("SearchRequest")[0];

        let queryParts:Array<QueryPart> = [];

        for(let iCondi:number=0;iCondi<xmlDocRoot.children.length;iCondi++)
        {
            let condi:Element = xmlDocRoot.children[iCondi];
            let condiFieldName = condi.nodeName/*.toLowerCase()* /.replace("Collaboration", "");*/
            for(let iCheckFor:number=0;iCheckFor<condi.children.length;iCheckFor++)
            {
                let checkFor:Element = condi.children[iCheckFor];
                let condiId = checkFor.innerHTML;   //TODO: QueryPart constr expects val!
                let exclude:boolean = checkFor.getAttribute("exclude") === "true";
                let type:string = checkFor.getAttribute("type");   //TODO: handle the 'type' attr
                let queryPart:QueryPart = new QueryPart(condiFieldName, condiId, exclude);
                queryParts.push(queryPart);
            }
        }

        return queryParts;
    }

    public static o2SearchXML(queryParts:Array<QueryPart>, sort:string, sortAsc: boolean, filter:{name:string,value:string}[]) : string
    {
        let getCondis = function(queryParts:Array<QueryPart>) : Set<string>
        {
            let condis : Set<string> = new Set<string>();
            for(let i:number=0;i<queryParts.length;i++)
                condis.add(queryParts[i].field);
            return condis;

        };
        let condis : Set<string> = getCondis(queryParts);
        var oParser = new DOMParser();
        var xmlDoc = oParser.parseFromString('<SearchRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"></SearchRequest>', 'text/xml');
        var xmlDocRoot  = xmlDoc.getElementsByTagName("SearchRequest")[0];
        let condisCount : number = 0;
        condis.forEach(function(condi)
        {
            var xmlEleCondi = xmlDoc.createElement(condi);
            for(let i:number=0;i<queryParts.length;i++)
            {
                if(queryParts[i].field !== condi)continue;
                var xmlEleCheckFor = xmlDoc.createElement("CheckFor");
                xmlEleCheckFor.setAttribute("exclude", ""+queryParts[i].exclude);
                xmlEleCheckFor.appendChild(xmlDoc.createTextNode(queryParts[i].value));
                xmlEleCondi.appendChild(xmlEleCheckFor);
                condisCount++;
            }
            xmlDocRoot.appendChild(xmlEleCondi);
        });

        if(sort)
        {
            var xmlESortCondition = xmlDoc.createElement("SortCondition");
            {
                var xmlEAttributeName = xmlDoc.createElement("AttributeName");
                xmlEAttributeName.appendChild(xmlDoc.createTextNode(UXmlUtil._getSortField(sort)));
                xmlESortCondition.appendChild(xmlEAttributeName);
            }
            {
                var xmlEAscending = xmlDoc.createElement("Ascending");
                xmlEAscending.appendChild(xmlDoc.createTextNode(sortAsc ? "1" : "0"));
                xmlESortCondition.appendChild(xmlEAscending);
            }
            xmlDocRoot.appendChild(xmlESortCondition);
        }
        if(filter && (filter.length > 0))
        {   //TODO: do I really have to list all possible filterFieldName's with empty value? 
            var xmlEFilterCondition = xmlDoc.createElement("FilterCondition");
            for(let i:number=0;i<filter.length;i++)
            {
                var xmlEfilterFieldName = xmlDoc.createElement(filter[i].name);
                xmlEfilterFieldName.appendChild(xmlDoc.createTextNode(filter[i].value));
                xmlEFilterCondition.appendChild(xmlEfilterFieldName);
            }
            xmlDocRoot.appendChild(xmlEFilterCondition);
        }

        if(condisCount < 1)
        {
            console.log("o2SearchXML ERR: !condisCount");
            console.log(queryParts);
        }

        var oSerializer = new XMLSerializer();
        var sXML = oSerializer.serializeToString(xmlDoc);
        return sXML;
    }

    private static _getSortField(fieldName : string)
    {
        //TODO: how to do it better?
        if(fieldName.toLowerCase() == "title")                  return "CollaborationTitle";
        if(fieldName.toLowerCase() == "id")                     return "CollaborationId";
        if(fieldName.toLowerCase().indexOf('budget') > -1)      return "Budget";
        console.log("sortfield? field:'"+fieldName+"'");
        return fieldName;
    }
}
