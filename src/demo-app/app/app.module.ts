﻿import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ButtonDemoComponent } from './components/button-demo/button-demo.component';
import { CardDemoComponent } from './components/card-demo/card-demo.component';
import { CheckboxDemoComponent } from './components/checkbox-demo/checkbox-demo.component';
import { FabDemoComponent } from './components/fab-demo/fab-demo.component';
import { LinearProgressDemoComponent } from './components/linear-progress-demo/linear-progress-demo.component';
import { MenuDemoComponent } from './components/menu-demo/menu-demo.component';
import { NavbarComponent } from './components/navigation/navbar.component';
import { RadioDemoComponent } from './components/radio-demo/radio-demo.component';
import { SnackbarDemoComponent } from './components/snackbar-demo/snackbar-demo.component';
import { SwitchDemoComponent } from './components/switch-demo/switch-demo.component';
import { TabsDemoComponent } from './components/tabs-demo/tabs-demo.component';
import { TextfieldDemoComponent } from './components/textfield-demo/textfield-demo.component';
import { ToolbarDemoComponent } from './components/toolbar-demo/toolbar-demo.component';
import { TypographyDemoComponent } from './components/typography-demo/typography-demo.component';

import { MaterialModule } from './../../../dist';
// import { MaterialModule } from './../../../src/lib';
import { HomeComponent } from './components/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    MaterialModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    ButtonDemoComponent,
    CardDemoComponent,
    CheckboxDemoComponent,
    FabDemoComponent,
    HomeComponent,
    LinearProgressDemoComponent,
    MenuDemoComponent,
    NavbarComponent,
    RadioDemoComponent,
    SnackbarDemoComponent,
    SwitchDemoComponent,
    TabsDemoComponent,
    TextfieldDemoComponent,
    ToolbarDemoComponent,
    TypographyDemoComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
