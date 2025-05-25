import { TestBed } from '@angular/core/testing';

import { AvailabilitiesService } from './availabilities.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AvailabilitiesService', () => {
  let service: AvailabilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AvailabilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
