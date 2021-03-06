import {
  Directive,
  HostBinding
} from '@angular/core';

@Directive({
  selector: 'mdc-toolbar-row'
})
export class ToolbarRowDirective {
  @HostBinding('class.mdc-toolbar__row') className: string = 'mdc-toolbar__row';
}