import { ComponentRef, ComponentFactory, ComponentFactoryResolver, NgModule, Compiler, Component, OnInit, Output, ViewEncapsulation, ViewChild, ViewContainerRef } from '@angular/core';
import { DlgService } from '../../services/dlg.service';

@Component({
  selector: 'app-dlg',
  templateUrl: './dlg.component.html',
  styleUrls: ['./dlg.component.css'],
   host: {
     'class': 'ui-helper-clearfix clearfix'
   },
  encapsulation: ViewEncapsulation.None
})
export class DlgComponent implements OnInit
{
  @ViewChild('dlgContent4Template', { read: ViewContainerRef }) dlgContent4Template: ViewContainerRef;

  @Output() content:string = "";
  @Output() header :string = " ";

  showDlg : boolean = false;
  childComponentRef : ComponentRef<any> = null;

  constructor(private dlgService : DlgService, private compiler: Compiler, private componentFactoryResolver: ComponentFactoryResolver)
  {
    this.dlgService.dlgMsg.subscribe((msg:any) => {

      if(this.childComponentRef)
      {
        this.childComponentRef.destroy();
        this.childComponentRef = null;
      }

      this.showDlg = true;
      this.content = msg.content; //solution for 'WARNING: sanitizing HTML stripped some content' is: SaniPipe
      this.header = msg.header;

      if(msg.attrs && msg.attrs.component)
      {
        let childComponentFactory:ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(msg.attrs.component);
        this.childComponentRef = this.dlgContent4Template.createComponent(childComponentFactory);

        /* ALTERNATIVE:
          // Inputs need to be in the following format to be resolved properly
          let inputProviders = Object.keys(data.inputs).map((inputName) => {return {provide: inputName, useValue: data.inputs[inputName]};});
          let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

          // We create an injector out of the data we want to pass down and this components injector
          let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);

          // We create a factory out of the component we want to create
          let factory = this.resolver.resolveComponentFactory(data.component);

          // We create the component using the factory and the injector
          let component = factory.create(injector);

          // We insert the component into the dom container
          this.dynamicComponentContainer.insert(component.hostView);
        */
      }

    });
  }

  ngOnInit()
  {

  }
  onAfterHide(event:any) : void
  {
      this.content = "&nbsp;";

      if(this.childComponentRef)
      {
        this.childComponentRef.destroy();
        this.childComponentRef = null;
      }
  }
  hideDlg() : void
  {
    this.showDlg=false;
    this.onAfterHide(null);
  }
}
