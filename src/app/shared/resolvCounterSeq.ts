import { Hit } from './pojo/hit';
import { ResolvCounter } from './resolvCounter';

export class ResolvCounterSeq extends ResolvCounter
{
    //TODO: what is the best number: fast & do not block the ui!
    public static MAX_CONCURRENT_HITRESOLUTION = 1;

    constructor(hits : Array<Hit>, onCompletion : (hitCount : number, timeInMs:number) => void)
    {
        super(hits, onCompletion);
    }
    public startResolve()
    {
        let iIsResolutionInProgress:number = 0;
        for(let i:number=0;i<this.hits.length;i++)
        {
            let bIsResolutionInProgress:boolean = this.hits[i].resolve(this, i, false/*//TODO: make this fragile code better!*/);
            if( bIsResolutionInProgress)
            {
                iIsResolutionInProgress++;
                if(iIsResolutionInProgress > ResolvCounterSeq.MAX_CONCURRENT_HITRESOLUTION)
                {
                    break;
                }
            }
        }
        /*
        let firstResolutionBatch:boolean = (this.alreadyResolvedItems < 1);

        if (this.hits.length > this.alreadyResolvedItems)
        {
            let bIsResolutionInProgress:boolean = this.hits[this.alreadyResolvedItems].resolve(this, this.alreadyResolvedItems);
        }
        if(firstResolutionBatch)
        {   //start with some concurrent resolutions
            let foruntil = Math.min(this.hits.length, 5);
            for(let i:number=0;i<foruntil;i++)
            {
                this.hits[i].resolve(this, i);
            }
        }
        */
    }    
    public onResolved(index : number) : number
    {
        let still2BeResolved:number = super.onResolved(index);
        this.startResolve();
        return still2BeResolved;
    }
    public onAllResolved() : void
    {
        super.onAllResolved();
    }
}
