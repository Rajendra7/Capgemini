import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDowmComponent } from './drop-dowm.component';

describe('DropDowmComponent', () => {
  let component: DropDowmComponent;
  let fixture: ComponentFixture<DropDowmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropDowmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDowmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
