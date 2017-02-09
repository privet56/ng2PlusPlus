import { ElementRef, Component, OnInit, AfterViewInit, ViewChild, ContentChild, ChangeDetectionStrategy } from '@angular/core';
import { MfbButton } from '../3rdparty/ng-floating-button';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush   ////check only refs, not the contents ==> faster change Detection!
})
export class FooterComponent implements OnInit, AfterViewInit
{
  @ViewChild('privacyPolicy') vPrivacyPolicy :	ElementRef;
  @ViewChild('termsOfUse') vTermsOfUse :	ElementRef;
  @ViewChild('digitalID') vDigitalID :	ElementRef;

  static __vPrivacyPolicy :	ElementRef;
  static __vTermsOfUse :	ElementRef;
  static __vDigitalID :	ElementRef;

/////////////////// ng-floating-button cfg ///////////////////
  config:any;
  buttons: Array<MfbButton> = [
    {
      iconClass: 'floatingIcon2',
      label: 'Privacy Policy',
      onClick: function()
      {
        FooterComponent.__vPrivacyPolicy.nativeElement.click();
        return false;
      }
    },
    {
      iconClass: 'floatingIcon2',
      label: 'Terms of Use',
      onClick: function()
      {
        FooterComponent.__vTermsOfUse.nativeElement.click();
        return false;
      }
    },
    {
      iconClass: 'floatingIcon2',
      label: 'Digital ID',
      onClick: function()
      {
        FooterComponent.__vDigitalID.nativeElement.click();
        return false;
      }
    },
  ];

  placements = [
    {
      value: 'br',
      key: 'bottom right'
    },
    {
      value: 'bl',
      key: 'bottom left'
    },
    {
      value: 'tr',
      key: 'top right'
    },
    {
      value: 'tl',
      key: 'top left'
    },
  ];

  effects = [
     {
      value: 'mfb-zoomin',
      key: 'Zoom In'
    },
    {
      value: 'mfb-slidein',
      key: 'Slide In + Fade'
    },
    {
      value: 'mfb-fountain',
      key: 'Fountain'
    },
    {
      value: 'mfb-slidein-spring',
      key: 'Slide In (Spring)'
    }
  ]

  toggles = [
    'click',
    'hover'
  ] 
/////////////////// ng-floating-button cfg ///////////////////

  constructor()
  {
    //orig css: "css/ionicons.min.css"
    this.config =
    {
      placment: 'br',
      effect: 'mfb-slidein-spring',
      label: 'External Links',
      iconClass: 'floatingIcon1',//'ion-plus-round',
      activeIconClass: 'floatingIcon1 floatingIconActive',
      toggle: 'click',
      buttons: this.buttons
    }
  }

  ngOnInit()
  {

  }
  ngAfterViewInit()
  {
    FooterComponent.__vPrivacyPolicy = this.vPrivacyPolicy;
    FooterComponent.__vTermsOfUse = this.vTermsOfUse;
    FooterComponent.__vDigitalID = this.vDigitalID;
  }
}

