import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { QueryPart } from './pojo/querypart';

export class UStrUtil
{
    //ü = 65533
    protected static rxEmail : RegExp = new RegExp('(\\S+)@siemens.com', "g");
    protected static rxLink = new RegExp('(\\s)http(\\S+)', "g");
    protected static ue : string = String.fromCharCode(65533);
    protected static ueFound : number = 0;

    constructor()
    {
        
    }

    public static isNummericString(s:string, exceptions:string, trim:boolean) : boolean
    {
        if((s == null) || (s == undefined) || ((typeof s) !== 'string') || (s === ''))
        {
            return false;
        }
        if(trim)
        {
            s = s.trim();
        }
        for(let i:number=0;i<s.length;i++)
        {
            let c:string = s.charAt(i);
            let isNum:boolean = c >= '0' && c <= '9';
            if(!isNum && (exceptions.indexOf(c) > -1))
                continue;
            if(!isNum)
                return false;
        }
        return true;
    }

    public static entitifyObj(o : any) : any
    {
        if((typeof o) === 'string')
        {
            return UStrUtil.entitify(o);
        }
        for(let prop in o)
        {
            let propVal:any = o[prop];
            if(!propVal)
            {
                o[prop] = ""; 
            }
            else if((typeof propVal) === 'object')
            {
                UStrUtil.entitifyObj(propVal);
            }
            else if((typeof propVal) === 'string')
            {
                o[prop] = UStrUtil.entitify(propVal);
            }
        }
        return o;
    }
    public static entitify(s : string) : string
    {
        if(!s)return "";

        if(s.indexOf(UStrUtil.ue) > -1)
            console.log("ERR: ü coded wrongly!");
        /*temporary little fix
        while(s.indexOf(HtmlUtil.ue) > -1)
        {
            s = s.replace(HtmlUtil.ue, 'ü');
        }*/

        return UStrUtil.linkify(UStrUtil.emailify(s));
    }
    public static emailify(s : string) : string
    {
        if(s.indexOf("<a href='mailto:") > -1)
            return s;
        s = s.replace(UStrUtil.rxEmail, "<a href='mailto:$1@siemens.com'>$1@siemens.com</a>")
        return s;
    }
    public static linkify(s : string) : string
    {
        if(s.indexOf("<a href='http") > -1)
            return s;        
        s = s.replace(UStrUtil.rxLink, "$1<a href='http$2' target='_new'>http$2</a>")
        return s;
    }

    public static uint8ToString(buf:ArrayBuffer) : string
    {
        let out:string = '';
        for (let i:number = 0; i < buf.byteLength; i++)
        {
            out += String.fromCharCode(buf[i]);
        }
        return out;
    }
    public static diff(start:Date, end:Date) : string
    {
        let timeInMs:number = end.getTime() - start.getTime();
        let time : string = ""+timeInMs + " ms";
        if (timeInMs > 5555)
            time = ""+(timeInMs/1000) + " sec";
        return time;
    }
    public static trunc(s:string, limit:number, trail:string) : string
    {
        return s.length > limit ? s.substring(0, limit) + trail : s;
    }

    protected static __isAnEmptyObject__recDepth_errors:number = 0;
    public static isAnEmptyObject(o:any, debug:boolean, recDepth:number=0) : boolean
    {
        if(recDepth > 33)
        {
            //TODO: check why this happens with FF.!?
            console.log("ERR("+UStrUtil.__isAnEmptyObject__recDepth_errors+"): recDepth:"+recDepth+" "+o);
            if(UStrUtil.__isAnEmptyObject__recDepth_errors++ < 9)
            {
                console.log(o);
            }
            return true;
        }
        if((typeof o) === 'function')
        {
            if(debug)console.log("rF0("+(typeof o)+") "+o);
            return true;
        }
        if((typeof o) !== 'object')
        {
            if(debug)console.log("rF1("+(typeof o)+") "+o);
            return false;
        }

        for (var i in o)
        {
            var val = o[i];
            if(!val || UStrUtil.isAnEmptyObject(val, debug, recDepth+1))
            {
                continue;
            }
            if(debug)console.log("rF2 "+o+" i:"+i+" val:"+val);
            return false;
        }
        if(debug)console.log("rTRUE "+o);
        return true;
    }
    public static o2o(o:any, RecDepth:number, parent:any, maxRecDepth:number) : any
    {
        if(RecDepth > maxRecDepth)
        {
            return "";  //can be normal, e.g. window.navigator
        }
        
        let r = {};

        let attrCount = 0;
        for (var i in o)
        {
            let key = i;
            let val = o[i];
            if( val == null || val == undefined)
                continue;
            if(val === "")continue; //skip empty strings
            if((typeof val) === 'object')
            {
                if(val === parent)  continue;
                if(val === o)       continue;
                if(UStrUtil.isAnEmptyObject(val, false))continue;

                val = UStrUtil.o2o(val, RecDepth+1, o, maxRecDepth);
            }
            else if((typeof val) === 'function')
            {
                val = "FUNCTION:"+val;
                continue;   //not needed
            }

            r[key] = val;
            attrCount++;
        }
        return r;
    }
}
