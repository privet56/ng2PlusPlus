import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/core';
import { CfgService } from '../services/cfg.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
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
export class InfoComponent implements OnInit
{
  constructor()
  {

  }

  ngOnInit()
  {

  }
}
