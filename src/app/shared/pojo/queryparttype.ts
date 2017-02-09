
export class QueryPartType
{
    public field : string = "";
    public name : string = "";
    public values : {id:number, value:string}[] = new Array<{id:number, value:string}>();
    public excludeable : boolean = false;

    constructor(name:string, field:string, canExclude : boolean)
    {
        this.name = name;
        this.field = field;
        this.excludeable = canExclude;
    }
    public addValue(id:number, value:string)
    {
        //TODO: check if id is already within this.values
        this.values.push({id:id, value:value});
        return this;
    }
}
