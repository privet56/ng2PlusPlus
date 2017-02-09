import { Component, OnInit } from '@angular/core';
import { MsgService } from '../services/msg.service';
import {EditorModule,SharedModule} from 'primeng/primeng';
import { trigger, state, style, animate, transition } from '@angular/core';
import { CfgService } from '../services/cfg.service';
//import { routerCanReuse } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
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
  ]/*,
  styles: [
    `
    .ui-panel.ui-widget
    {
        background-color: red !important;
        color: red !important;
    }
  `]*/
})
export class AdminComponent implements OnInit
{
  public newsText: string = "HTML Editor Content";

  constructor(private msgService : MsgService)
  {

  }

  ngOnInit()
  {

  }
  onNewsSave() : void
  {
    this.msgService.warn('Not implemented Error', 'The "News Save" function is not yet implemented');
  }
}
