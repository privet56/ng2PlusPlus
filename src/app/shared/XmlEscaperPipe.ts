import {Pipe} from '@angular/core';

@Pipe({
  name: 'xmlesc'
})
export class XmlEscaperPipe
{
  transform(value: string) : string
  {
    if(!value)return value;

    return value.replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\r\n/g, "<br>")
                .replace(/ /g, "&nbsp;");
  }
}
