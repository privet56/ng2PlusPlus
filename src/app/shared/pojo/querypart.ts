
export class QueryPart
{
    public field : string = "";
    public value : string = "";
    public exclude : boolean = false;

    constructor(field:string, value:string,exclude:boolean)
    {
        this.field = field;
        this.value = value;
        this.exclude = exclude;
    }
}
