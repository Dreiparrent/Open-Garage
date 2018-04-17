import { NgModule } from '@angular/core';
import {
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule,
    MatSnackBarModule
} from '@angular/material';

import 'hammerjs';


@NgModule({
    imports: [
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatListModule,
        MatTabsModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatSelectModule,
        MatSnackBarModule
    ],
    exports: [
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatListModule,
        MatTabsModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatSelectModule,
        MatSnackBarModule
    ]
})

export class MaterialImports {

}