import { NgModule } from '@angular/core';
import { TabBarComponent } from './tab-bar.component';
import { TabDirective } from './tab.directive';


const MDC_TAB_DIRECTIVES = [
  TabBarComponent,
  TabDirective,
];


@NgModule({
  imports: [],
  declarations: MDC_TAB_DIRECTIVES,
  exports: MDC_TAB_DIRECTIVES,
})
export class TabsModule { }
