/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HitPerPagerComponent } from './hit-per-pager.component';

describe('HitPerPagerComponent', () => {
  let component: HitPerPagerComponent;
  let fixture: ComponentFixture<HitPerPagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitPerPagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitPerPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
