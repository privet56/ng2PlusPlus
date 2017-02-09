import { Hit } from './pojo/hit';

export class ResolvCounter
{
    protected alreadyResolvedItems : number = 0;
    protected start : number = new Date().getTime();
    protected onCompletion : (hitCount : number, timeInMs:number) => void;
    protected hits : Array<Hit> = null;

    constructor(hits : Array<Hit>, onCompletion : (hitCount : number, timeInMs:number) => void)
    {
        this.hits = hits;
        this.onCompletion = onCompletion;

        this.startResolve();
    }
    public startResolve()
    {
        let i:number=3;
        for(let i : number = 0;i < this.hits.length;i++)
        {
          this.hits[i].resolve(this, i);
        }
    }
    public onResolved(index : number) : number
    {
        this.alreadyResolvedItems++;
        let still2BeResolved = this.hits.length - this.alreadyResolvedItems;
        if (still2BeResolved < 1)
        {
            this.onAllResolved();
        }
        return still2BeResolved;
    }
    public onAllResolved() : void
    {
        let end : number = new Date().getTime();
        let diff_ms : number = end - this.start;
        let diff_sec : number = Math.floor(diff_ms / 1000);
        console.log("RESOLVED "+this.hits.length+"(="+this.alreadyResolvedItems+") in "+diff_ms+" ms = "+diff_sec+" seconds. ResolverClass: "+this.constructor.name);
        this.onCompletion(this.hits.length, diff_ms);
    }
}
