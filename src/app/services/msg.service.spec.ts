/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MsgService } from './msg.service';

describe('Service: Msg', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsgService]
    });
  });

  it('Msg should ...', inject([MsgService], (service: MsgService) =>
  {
    expect(service).toBeTruthy();
  }));
});
