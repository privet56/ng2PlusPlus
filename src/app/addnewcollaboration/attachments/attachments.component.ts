import { ViewChild, Component, OnInit } from '@angular/core';
import { MsgService } from '../../services/msg.service';
import { StaticService } from '../../services/static.service';
import { DlgService } from '../../services/dlg.service';

class Attachment
{
  constructor(public fn:string, public type:string, public fc:Uint8Array)
  {

  }
  public preview(len:number):string
  {
    let s:string = "";
    for (var i = 0; i < this.fc.length; i++)
    {
      s += String.fromCharCode(this.fc[i]);
      if(i > 99)
      {
        s += "...";
        break;
      }
    }
    return s;
  }
}

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent implements OnInit
{
  public attachments:Array<any> = new Array<any>();

  constructor(private msgService : MsgService, private dlgService : DlgService)
  {

  }

  ngOnInit()
  {

  }
  onFileAttachmentChanged(fileAttachment : HTMLInputElement) : void
  {
    let self = this;
    var reader = new FileReader();
    reader.onload = function(event:any)
    {
      //let sData:string = event.target.result;
      //(Ui|I)nt8Array,(Ui|I)nt16Array,(Ui|I)nt32Array   //Int32Array: byte length of Int32Array should be a multiple of 4
      //console.log(event.target.result.byteLength);
      //console.log(event);                   //ProgressEvent
      //console.log(event.target);            //FileReader
      //console.log(fileAttachment.files[0]); //File{name, type, lastModified}

      let aData:ArrayBuffer = event.target.result;
     
      var view = new Uint8Array(aData);
      let a:Attachment = new Attachment(fileAttachment.files[0].name, fileAttachment.files[0].type, view);

      self.msgService.inf(fileAttachment.files[0].name+' uploaded. Content:', a.preview(133));
      self.attachments.push(a);
    };
    if(fileAttachment.files && fileAttachment.files.length)
    {
      reader.readAsArrayBuffer(fileAttachment.files[0]);        //gets ArrayBuffer
      //reader.readAsDataURL(fileAttachment.files[0]);          //gets base64-encoded val      
      //reader.readAsBinaryString(fileAttachment.files[0]);
    }
    else
      console.log("cancelled");
  }
  onAddAttachment($event:any, fileAttachment : HTMLInputElement):boolean
  {
    fileAttachment.click();
    return false;
  }
  onRemove(attachment:any, i:number):boolean
  {
    this.attachments.splice(i, 1);
    return false;    
  }
}
