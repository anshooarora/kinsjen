import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJenkinsComponent } from './manage-jenkins.component';

describe('ManageJenkinsComponent', () => {
  let component: ManageJenkinsComponent;
  let fixture: ComponentFixture<ManageJenkinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageJenkinsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageJenkinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
