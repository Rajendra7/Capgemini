import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component'; 

import { HttpModule } from '@angular/http';
import { HeaderComponent } from './header/header.component';


import { DropDowmComponent } from './drop-dowm/drop-dowm.component'; 
import { RouterModule } from '@angular/router'; 

import { HttpClientModule }    from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent, 
   
    DropDowmComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule, 
    RouterModule,
    HttpModule,
    FormsModule,HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }






