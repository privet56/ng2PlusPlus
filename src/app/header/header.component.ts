import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UnicoService } from '../services/unico.service';
import { DlgService } from '../services/dlg.service';
import { MsgService } from '../services/msg.service';
import { HttpCall } from '../shared/pojo/httpCall';
import { UStrUtil } from '../shared/uStrUtil';
import { WsCallHistoryComponent } from './ws-call-history/ws-call-history.component';
import { HttpCallsServiceService } from '../services/http-calls-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit
{
  public bCollapsed : boolean = false;
  public bLoading : boolean = false;
  public timeOut : any = null;
 
  constructor(private unicoService : UnicoService,
              private dlgService : DlgService,
              private msgService : MsgService,
              private httpCallsServiceService : HttpCallsServiceService)
  {

  }

  ngOnInit()
  {
    this.unicoService.loadingChange.subscribe((n:number) =>
    {                                         //TODO: better move this logic into ValueEmitter.emit !?
      clearTimeout(this.timeOut);             //workaround for error:
      this.timeOut = setTimeout(() =>         //"Expression has changed after it was checked""
      {
        this.bLoading = (n > 0);

      }, 222);
    });
  }

  ngAfterViewInit()
  {
    let activity:string = "HTML5CLIENT";
    let activityDetails:string = window.location.href;
    var _o = {};

    _o = UStrUtil.o2o(window.navigator, 0, null, 3);
    if(window.document.cookie)    _o["cookie"]    = window.document.cookie;
    if(window.document.referrer)  _o["referrer"]  = window.document.referrer;

    let activityDetailsExtended = JSON.stringify(_o);
    this.unicoService.Log(activity, activityDetails, activityDetailsExtended).then(result =>
    {
      //console.log(""+activity+" response:"+result);
    });
  }

  loading() : boolean
  {
    return this.bLoading;
  }
  public onCollapse(collapseIcon:any, collapseText:any, headerVisual:any) : boolean
  {
    this.bCollapsed = !this.bCollapsed;

    if(false)
    {
      //document.getElementsByTagName('html')[0].style.paddingTop = this.bCollapsed ? '105px' : '170px';
      //$(window).trigger('resize');
    }
    else
    {
      $( headerVisual ).animate(
        {
          //does not work as expected with ng2 2.4.3 (or bootstrap?) 
          //paddingTop: this.bCollapsed ? '105px' : '170px'
          //paddingTop: this.bCollapsed ? '0px' : '0px'
          height: this.bCollapsed ? '66px' : '100%',
          width:'100%'
        },
        500,
        function()
        {
          // Animation complete.
          $(window).trigger('resize');
        });
    }
    return false;
  }
  public onHistory() : boolean
  {
    let header : string = "UNICO++ WebService Call History";

    if(!header) //if(false) would bring exception "unreachable code detected"
    {
      //TODO: use own dlg instead of dlg service to have ng2 templates?
      let txt:string = "<div><table>"; //TODO: header (with url?)
      let calls:Array<HttpCall> = this.httpCallsServiceService.getCalls();
      for(let i:number = calls.length-1;i>-1;i--)
      {
        let call:HttpCall = calls[i];
        txt += "<tr>";                        //TODO: support mouseover
        txt +=  "<td>"+call.id+"</td>";
        txt +=  "<td>"+call.success+"</td>";  //TODO: make nice
        txt +=  "<td>"+call.diff()+"</td>";
        txt += "</tr>";
      }

      txt += "</table></div>";
      this.dlgService.showDlgMsg(txt, header, null, null);
    }
    else
    {
      this.dlgService.showDlgMsg(null, header, null, {component:WsCallHistoryComponent});
    }

    return false;
  }
  public onHelp() : boolean
  {
    //TODO: externalize template!
    let imgs : string = `<img src='assets/arrowExternal.png' style='margin-left:6px;margin-right:3px;' />
                          <img src='assets/file_pdf.png' style='margin-left:3px;margin-right:6px;' />`;
    let txt : string = `
      <h3>Here you can get information about UNICO++!</h3>
      <div style='padding-top:6px;padding-bottom:6px;'>
      <div class='linkdiv'><a href="assets/QuickStartGuide_UnicoPlus.pdf" target='_new'>
        `+imgs+`
        UNICO++ manual
      </a></div>
      <div class='linkdiv'><a href="assets/QuickStartGuide_UnicoPlus.pdf" target='_new'>
        `+imgs+`
        ...something else...
      </a></div>
      <div class='linkdiv'><a href="assets/QuickStartGuide_UnicoPlus.pdf" target='_new'>
        `+imgs+`
        ...something else...
      </a></div>
      <div class='linkdiv'><a href="assets/QuickStartGuide_UnicoPlus.pdf" target='_new'>
        `+imgs+`
        ...something else...
      </a></div>
      </div>
    `;

    let header : string = "UNICO++ Help";
    this.dlgService.showDlgMsg(txt, header, null, null);
    
    return false;
  }
  onLogout() : boolean
  {
    this.msgService.error('Not implemented Error', 'The "LOGOUT" function is not yet implemented');
    return false;
  }
}
