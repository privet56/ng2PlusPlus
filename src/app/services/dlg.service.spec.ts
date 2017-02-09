/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DlgService } from './dlg.service';

describe('Service: Dlg', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DlgService]
    });
  });

  it(' Dlg should ...', inject([DlgService], (service: DlgService) =>
  {
    expect(service).toBeTruthy();
  }));
});
