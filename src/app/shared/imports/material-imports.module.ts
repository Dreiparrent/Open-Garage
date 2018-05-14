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
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatDialogModule
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
        MatSnackBarModule,
        MatAutocompleteModule,
        MatTooltipModule,
        MatDialogModule
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
        MatSnackBarModule,
        MatAutocompleteModule,
        MatTooltipModule,
        MatDialogModule
    ]
})

export class MaterialImports {

}