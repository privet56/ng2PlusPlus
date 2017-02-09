import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit
{
  public contacts:Array<any> = new Array<any>();
  constructor()
  {
    this.contacts.push({}); //there is always at least 1 entry
  }

  ngOnInit()
  {

  }

  onSCD() : boolean
  {
    return false;
  }
  addFurtherContact($event:any):boolean
  {
    this.contacts.push({});
    return false;
  }
  onRemove(contact:any, i:number):boolean
  {
    this.contacts.splice(i, 1);
    return false;    
  }
}
