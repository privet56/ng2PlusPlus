/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpCallsServiceService } from './http-calls-service.service';

describe('HttpCallsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCallsServiceService]
    });
  });

  it('should ...', inject([HttpCallsServiceService], (service: HttpCallsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
