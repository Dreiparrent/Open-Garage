import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { SwUpdateService } from './sw-update.service';

describe('AppComponent', () => {
    let mockSw;
    beforeEach(async(() => {
        mockSw = jasmine.createSpyObj('SwUpdate', ['open']);
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            providers: [
                { provide: SwUpdateService, useValue: mockSw }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
