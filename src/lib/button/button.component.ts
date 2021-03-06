﻿import {
  Component,
  ElementRef,
  Input,
  HostBinding,
  HostListener,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { Ripple } from '.././ripple/ripple.directive';

const MDC_BUTTON_STYLES = require('@material/button/mdc-button.scss');

@Component({
  selector: 'button[mdc-button]',
  styles: [String(MDC_BUTTON_STYLES)],
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {
  ripple: Ripple;

  @Input() type: string;
  @Input() disabled: string;
  @Input() raised: boolean;
  @Input() primary: boolean;
  @Input() dense: boolean;
  @Input() compact: boolean;
  @Input() accent: boolean;
  @Input() cardAction: boolean;
  @HostBinding('tabindex') get tabindex(): number {
    return this.disabled ? -1 : 0;
  }
  @HostBinding('attr.type') get attrType(): string {
    return this.type ? this.type : 'button';
  }
  @HostBinding('class.mdc-button') className: string = 'mdc-button';
  @HostBinding('class.mdc-button--raised') get classRaised(): string {
    return this.raised ? 'mdc-button--raised' : '';
  }
  @HostBinding('class.mdc-button--primary') get classPrimary(): string {
    return this.primary ? 'mdc-button--primary' : '';
  }
  @HostBinding('class.mdc-button--accent') get classAccent(): string {
    return this.accent ? 'mdc-button--accent' : '';
  }
  @HostBinding('class.mdc-button--dense') get classDense(): string {
    return this.dense ? 'mdc-button--dense' : '';
  }
  @HostBinding('class.mdc-button--compact') get classCompact(): string {
    return this.compact ? 'mdc-button--compact' : '';
  }
  @HostBinding('class.mdc-card__action') get classCardAction(): string {
    if (this.cardAction) {
      this.compact = true;
    }
    return this.cardAction ? 'mdc-card__action' : '';
  }
  @HostListener('keydown', ['$event']) onkeydown(evt) {
    this.handleKeyboardDown_(evt);
  }
  @HostListener('keyup', ['$event']) onkeyup(evt) {
    this.handleKeyboardUp_(evt);
  }

  constructor(
    private _renderer: Renderer2,
    private _root: ElementRef) {
    this.ripple = new Ripple(this._renderer, this._root);
  }

  handleKeyboardDown_(evt: KeyboardEvent) {
    const { keyCode, key } = evt;
    const isSpace = key === 'Space' || keyCode === 32;
    const isEnter = key === 'Enter' || keyCode === 13;

    if (isSpace || isEnter) {
      this.ripple.active = true;
      evt.preventDefault();
    }
  }

  handleKeyboardUp_(evt: KeyboardEvent) {
    const { keyCode, key } = evt;
    const isSpace = key === 'Space' || keyCode === 32;
    const isEnter = key === 'Enter' || keyCode === 13;

    if (isSpace || isEnter) {
      this.ripple.active = false;
      evt.preventDefault();
    }
  }
}