import { UStrUtil } from '../uStrUtil';

export class HttpCall
{
    public static __IDS:number = 0;

    public id:number=0;
    public name : string = null;
    public request : string = null;
    public success : boolean = false;
    public start : Date = null;
    public end : Date = null;
    public isCached : boolean = false;
    public response:string = null;

    constructor(id:string, content:string, success:boolean, start:Date, isCached:boolean, end?:Date)
    {
        this.id = HttpCall.__IDS++;
        this.name = id;
        this.request = content;
        this.success = success;
        this.start = start;
        this.isCached = isCached;
        this.end = end ? end : null;
    }
    get time() : number
    {
        if(!this.end)
            return 0;
        
        let timeInMs:number = this.end.getTime() - this.start.getTime();
        return timeInMs;
    }
    get requestEscaped() : string
    {
        return this.request ? this.request.replace(/</g, "&lt;").replace(/>/g, "&gt;") : null;
    }
    get responseEscaped() : string
    {
        let r:string = this.response ? this.response
                                            .replace(/</g, "&lt;")
                                            .replace(/>/g, "&gt;")
                                            .replace(/\r\n/g, "<br>")
                                            .replace(/ /g, "&nbsp;")
                                        : null;
        return r;
    }
    get requestlen() : number
    {
        return this.request ? this.request.length : 0;
    }
    get responselen() : number
    {
        return this.response ? JSON.stringify(this.response).length : 0;
    }
    
    public diff() : string
    {
        if(!this.end)
        {
            return "running...";
        }
        return UStrUtil.diff(this.start, this.end);
    }
}
