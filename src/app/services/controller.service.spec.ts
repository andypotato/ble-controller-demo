import { TestBed } from '@angular/core/testing';

import { ControllerService } from './controller.service';

describe('ControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ControllerService = TestBed.get(ControllerService);
    expect(service).toBeTruthy();
  });
});
