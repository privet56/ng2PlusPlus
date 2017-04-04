import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, DoCheck } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/core';
import { DlgService } from '../services/dlg.service';
import { CfgService } from '../services/cfg.service';
import { UnicoService } from '../services/unico.service';
import { UStrUtil } from '../shared/uStrUtil';
import { Tooltip } from 'primeng/primeng';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
   host: {
     '[@routeAnimation]': 'true',
     '[style.display]': "'block'",
     //'[style.position]': "'absolute'"
   },
  animations: [
    trigger('routeAnimation', [
      state('*', style({transform: 'translateX(0)', opacity: 1})),
      transition('void => *', [
        style({transform: 'translateX(-100%)', opacity: 0}),
        animate(CfgService.routeAnimationLength)
      ]),
      transition('* => void', animate(CfgService.routeAnimationLength, style({transform: 'translateX(100%)', opacity: 0})))
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit//, DoCheck
{
  //@ViewChildren(Tooltip) vTooltips : QueryList<Tooltip>;

  public news : any = { };
  public event : any = { };

  private vid : string = `
  <video autoplay controls width="100%" height="100%">
    <source src="%URL%" type="video/mp4">
  </video>`;

  constructor(private dlgService : DlgService,
              private unicoService : UnicoService)
  {

  }
  ngOnInit()
  {
    //alternative: call in ngAfterInit
    this.unicoService.GetNewsEntries(2).then((t : any) =>
    {
      if(!t)return;//error handling is in the service
      this.news = UStrUtil.entitifyObj(t[0]);
    });
    this.unicoService.GetEventsEntries(2).then((t : any) =>
    {
      if(!t)return;
      this.event = UStrUtil.entitifyObj(t[0]); 
    });
  }
  onPDF(filename:string, lnk:HTMLLinkElement) : boolean
  {
    lnk.href = filename;
    lnk.click();
    return false;
  }
  onVid(filename:string, b:HTMLButtonElement) : boolean
  {
    let vid : string = this.vid.replace("%URL%", filename);
    let header : string = b.attributes['label'].value;
    this.dlgService.showDlgMsg(vid, header, null, null);
    return false;
  }
  onText(o:any, title:string) : boolean
  {
    let txt : string = `
      <h3>`+o.Name+`</h3>
      <span>`+o.Description+`</span>
    `;

    let header : string = title;//text.substring(text.lastIndexOf('_')+1).toUpperCase();
    this.dlgService.showDlgMsg(txt, header, null, null);
    return false;
  }
  ngAfterViewInit() : void
  {
    //$(document).tooltip();
  }
}
