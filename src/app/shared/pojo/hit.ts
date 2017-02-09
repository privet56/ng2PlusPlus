import { UnicoService } from '../../services/unico.service';
import { ResolvCounter } from '../resolvCounter';

export class Hit
{
    public static RESOLVING_TITLE = "[resolving...]";
    public id : number = -1;
    public Title : string = "";

    //this class with pre-initializer would not be needed if you would use optional operator ? in the template,
    // like hit.hitDetails?.SiemensContacts?.SiemensContact?.Name 
    public hitDetails : any = {

        Title: "",
        StatusName:"",
        SiemensSectorName:"",
        SiemensContacts:
        {
            SiemensContact:
            {
                Name:"",
                FirstName:""
            }
        },
        SiemensBudget:"0",
        CollaborationTypeName:"",
        LastRevisor:""
    };

    unicoService : UnicoService;

    constructor(id : number, unicoService : UnicoService)
    {
        this.id = id;
        this.unicoService = unicoService;

    }
    public getTitle() : string
    {
        this.resolve(null);
        return this.Title;
    }

    private resolvers : Set<ResolvCounter> = new Set<ResolvCounter>();

    protected notifyResolvers() : void
    {
        this.resolvers.forEach(function(resolvCounter:ResolvCounter)
        {
            resolvCounter.onResolved(-1);
        });
        this.resolvers.clear();
    }

    public resolve(resolvCounter : ResolvCounter, hitIndex?:number, notifyResolversAlsoIfAlreadyResolved?:boolean) : boolean
    {
        if(resolvCounter)this.resolvers.add(resolvCounter);

        /*{
            let resolved:boolean = this.Title && (this.Title !== Hit.RESOLVING_TITLE);
            let currentlyResolving:boolean = (this.Title === Hit.RESOLVING_TITLE);
            console.log("resolving hit "+hitIndex+" resolved:"+resolved+" currentlyResolving:"+currentlyResolving);
        }*/

        let i:number=3;

        {
            let resolved:boolean = this.Title && (this.Title !== Hit.RESOLVING_TITLE);
            if (resolved)
            {
                if(notifyResolversAlsoIfAlreadyResolved)this.notifyResolvers();
                return false;
            }
        }
        {
            let currentlyResolving:boolean = (this.Title === Hit.RESOLVING_TITLE);
            if (currentlyResolving)
            {
                return true;
            }
        }

        this.Title = Hit.RESOLVING_TITLE;

        this.unicoService.GetCollaborationDetails(this.id).then(hitDetails =>
        {
            this.Title = hitDetails.Title ? hitDetails.Title : ""+this.id;
            this.hitDetails = hitDetails;
            if(!this.hitDetails.SiemensBudget)
                this.hitDetails.SiemensBudget = "0";

            this.notifyResolvers();
        });

        return true;
    }
    public getSiemensBudget() : string
    {
        this.resolve(null);

        if(!this.hitDetails.SiemensBudget)
            this.hitDetails.SiemensBudget = "0";        
        //do never return undef/null value, because currencyFilter needs a valid value!
        return this.hitDetails.SiemensBudget;
    }
}
