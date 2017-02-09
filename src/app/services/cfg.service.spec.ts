/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CfgService } from './cfg.service';

describe('Service: Cfg', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CfgService]
    });
  });

  it(' Cfg should ...', inject([CfgService], (service: CfgService) =>
  {
    expect(service).toBeTruthy();

  }));
});
