import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolitiqueCookies } from './politique-cookies';

describe('PolitiqueCookies', () => {
  let component: PolitiqueCookies;
  let fixture: ComponentFixture<PolitiqueCookies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolitiqueCookies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolitiqueCookies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
