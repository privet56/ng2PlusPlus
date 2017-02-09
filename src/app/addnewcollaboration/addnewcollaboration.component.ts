import { Component, OnInit } from '@angular/core';
import { MsgService } from '../services/msg.service';
import { StaticService } from '../services/static.service';
import { DlgService } from '../services/dlg.service';

@Component({
  selector: 'app-addnewcollaboration',
  templateUrl: './addnewcollaboration.component.html',
  styleUrls: ['./addnewcollaboration.component.css']
})
export class AddnewcollaborationComponent implements OnInit
{
  protected collaborationTypes:Array<{name:string,value:string}> = new Array<{name:string,value:string}>();

  constructor(private msgService : MsgService, private staticService : StaticService, private dlgService : DlgService)
  {
    //TODO: replace dummy eles with real:
    this.collaborationTypes.push({name:'Research Project!',value:'Research Project'});

  }

  ngOnInit()
  {

  }
  onHelp():boolean
  {
    this.staticService.show("help.addnewcollab", "Add New Collaboration - Help");
    return false;
  }
  toggleNextTR($event:any):boolean
  {
    //alternative: this.renderer.setElementStyle( this.element.nativeElement, "border-width", "3px");
    let ele:Element = $event.srcElement;
    while(ele && (ele.tagName.toUpperCase() != "TR"))
      ele = ele.parentElement;
    ele = ele.nextElementSibling;
    let jQE:any = $(ele);
    jQE.animate({
      lineHeight: "toggle"
    }, 500, function() { /* Animation complete*/ });
    $("input, select",jQE).animate({
      height: "toggle"
    }, 500, function() { /* Animation complete*/ });
   
    //$(jQE).toggle('slow');

    return false;
  }
  addnewcollabForm(form:any):boolean
  {
    return false;
  }
}
