import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsPlpComponent } from './models-plp.component';

describe('ModelsPlpComponent', () => {
  let component: ModelsPlpComponent;
  let fixture: ComponentFixture<ModelsPlpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelsPlpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelsPlpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
