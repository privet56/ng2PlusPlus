/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaticService } from './static.service';

describe('Service: StaticService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaticService]
    });
  });

  it(' StaticService should ...', inject([StaticService], (service: StaticService) =>
  {
    expect(service).toBeTruthy();
  }));
});
