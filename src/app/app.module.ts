import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Component, Input, trigger, state, style, transition, animate } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { UnicoRoutingModule } from './app-routing.module';

import { NgbModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { Draggable, Droppable, DragDropModule, ChartModule, InputSwitchModule, DialogModule, FieldsetModule, EditorModule, PanelModule, GrowlModule, ConfirmationService, MessagesModule, ConfirmDialogModule, TooltipModule, DataTableModule,SharedModule, MultiSelectModule, ButtonModule, InputTextModule, DropdownModule, TabViewModule, TabPanel } from 'primeng/primeng';
//...and don't forget the imports below
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { WsCallHistoryComponent } from './header/ws-call-history/ws-call-history.component';
import { CenterComponent } from './center/center.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { SearchFormLineComponent } from './search/search-form-line/search-form-line.component';
import { SearchFormLinesComponent } from './search/search-form-lines/search-form-lines.component';
import { ResultlistComponent } from './search/resultlist/resultlist.component';
import { MsgsComponent } from './header/msgs/msgs.component';
import { MsgService } from './services/msg.service';
import { AdminComponent } from './admin/admin.component';
import { DlgComponent } from './shared/dlg/dlg.component'
import { DlgService } from './services/dlg.service';
import { CfgService } from './services/cfg.service';
import { StaticService } from './services/static.service';
import { UnicoService } from './services/unico.service';
import { InfoComponent } from './info/info.component';
import { ValueEmitter } from './shared/ValueEmitter';
import { TruncatePipe } from './shared/truncate';
import { UErrorHandler } from './shared/UErrorHandler';
import { SaniPipe } from './shared/sani';
import { XmlEscaperPipe } from './shared/XmlEscaperPipe';
import { ng2mfbModule } from './3rdparty/ng-floating-button';
import { GraphsComponent } from './search/resultlist/graphs/graphs.component';
import { GraphComponent } from './search/resultlist/graph/graph.component'; 
import { PersistentRouterOutlet } from './shared/PersistentRouterOutlet';
import { AddnewcollaborationComponent } from './addnewcollaboration/addnewcollaboration.component';
import { ContactsComponent } from './addnewcollaboration/contacts/contacts.component';
import { AttachmentsComponent } from './addnewcollaboration/attachments/attachments.component';
import { HttpCallsServiceService } from './services/http-calls-service.service';
import { HitPerPagerComponent } from './search/resultlist/hit-per-pager/hit-per-pager.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    WsCallHistoryComponent,
    CenterComponent,
    HomeComponent,
    SearchComponent,
    SearchFormLineComponent,
    SearchFormLinesComponent,
    ResultlistComponent,
    MsgsComponent,
    AdminComponent,
    DlgComponent,
    InfoComponent,
    TruncatePipe,
    SaniPipe,
    XmlEscaperPipe,
    GraphsComponent,
    HitPerPagerComponent,
    GraphComponent, 
    PersistentRouterOutlet, AddnewcollaborationComponent, ContactsComponent, AttachmentsComponent
    
  ],
  imports: [
    NgbModule.forRoot(),
    DragDropModule,
    ChartModule,
    DialogModule,
    InputSwitchModule,
    FieldsetModule,
    EditorModule,
    PanelModule,
    GrowlModule,
    MessagesModule,
    DataTableModule,
    ConfirmDialogModule,
    TooltipModule,
    SharedModule,
    MultiSelectModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    TabViewModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    UnicoRoutingModule,
    ng2mfbModule
    
  ],
  entryComponents: [AppComponent, WsCallHistoryComponent],
  providers: [ MsgService, DlgService, CfgService, ConfirmationService, UnicoService, StaticService, HttpCallsServiceService,
                { provide: ErrorHandler, useClass: UErrorHandler }
            ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
