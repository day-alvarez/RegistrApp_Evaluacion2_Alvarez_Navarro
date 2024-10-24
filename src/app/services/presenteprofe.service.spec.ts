import { TestBed } from '@angular/core/testing';

import { PresenteprofeService } from './presenteprofe.service';

describe('PresenteprofeService', () => {
  let service: PresenteprofeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresenteprofeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
