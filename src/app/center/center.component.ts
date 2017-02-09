import { ElementRef, Component, OnInit, AfterViewInit, AfterViewChecked, QueryList, Query, ViewChildren, ViewChild, ContentChildren, ContentChild } from '@angular/core';
import { ProgressBarModule, TabViewModule, TabView, TabPanel } from 'primeng/primeng';
import { UnicoRoutingModule } from '../app-routing.module';
import { Routes, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.css']
})
export class CenterComponent implements OnInit, AfterViewInit
{
  @ViewChildren(TabPanel) vTabs : QueryList<TabPanel>;
	@ContentChildren(TabPanel)	cTabs :	QueryList<TabPanel>;
  @ViewChild('tabView') tabsView :	TabView;

  constructor(private centerElement : ElementRef,
              private router : Router,
              private unicoRoutingModule : UnicoRoutingModule)
  {
     
  }

  ngAfterViewInit()
  {
    //TODO: disable(hide?) notallowed tabs 

    setTimeout(() => 
    { 
      let activeRouteIndex = this.unicoRoutingModule.getActiveRouteIndex(this.router);
      if( activeRouteIndex > 0)
      {
        //select tab from url
        let tabs : TabPanel[] = this.vTabs.toArray();
        tabs[0].selected = false;
        tabs[activeRouteIndex].selected = true;
      }
    }, 9);

    
    { //setup onresizer
      let self = this;
      var onresize = function()
      {
        self.onResize();
      };
      //$( window ).resize(onresize).on("load",function(){setTimeout(() => { onresize(); }, 333);});
      $( window ).resize(onresize);
      self.onResize();
    }
  }

  public onResize() : void
  {
    var eCenter = $("#centeroutlet");
    var eBefore = eCenter.prev();
    var bottomBefore = eBefore.position().top + eBefore.outerHeight(true);
    var eAfter = $("#footer");
    var topAfter = eAfter.outerHeight(true);
    var centersize = $( window ).height() - (bottomBefore + topAfter);
    eCenter.height(centersize);
  }

  ngOnInit()
  {
  }

  isVisible(tabName : string) : boolean
  {
    //TODO: ask service if tab allowed!
    return true;
  }

  onTabSelected(e:any) : void
  {
    this.unicoRoutingModule.routeFromIndex(e.index, this.router);
  }
}
