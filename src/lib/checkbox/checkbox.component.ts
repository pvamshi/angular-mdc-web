import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  Provider,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MDCCheckboxAdapter } from './checkbox-adapter';
import { Ripple } from '.././ripple/ripple.directive';

const { MDCFormField } = require('@material/form-field');
const { MDCCheckboxFoundation } = require('@material/checkbox');
const MDC_CHECKBOX_STYLES = require('@material/checkbox/mdc-checkbox.scss');

let formField_ = null;
let nextElId_ = 0;

export const MD_CHECKBOX_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true
};

type UnlistenerMap = WeakMap<EventListener, Function>;

@Component({
  selector: 'mdc-checkbox',
  templateUrl: './checkbox.component.html',
  styles: [String(MDC_CHECKBOX_STYLES)],
  encapsulation: ViewEncapsulation.None,
  providers: [
    MD_CHECKBOX_CONTROL_VALUE_ACCESSOR
  ]
})

export class CheckboxComponent implements AfterViewInit, OnDestroy {
  ripple: Ripple;

  @Input() id: string = `mdc-checkbox-${++nextElId_}`;
  get inputId(): string {
    return `input-${this.id}`;
  }
  @Input() checked: boolean;
  @Input() indeterminate: boolean;
  @Input() disabled: boolean;
  @Input() tabindex: number = 0;
  @Input('aria-label') ariaLabel: string;
  @Input('aria-labelledby') ariaLabelledby: string;
  @Output() change: EventEmitter<Event> = new EventEmitter<Event>();
  @HostBinding('class.mdc-checkbox') className: string = 'mdc-checkbox';
  @HostBinding('class.mdc-checkbox--disabled') get classDisabled(): string {
    if (this.disabled) {
      if (formField_) {
        formField_.input = null;
      }
    } else {
      if (formField_) {
        formField_.input = this;
      }
    }
    return this.disabled ? 'mdc-checkbox--disabled' : '';
  }
  @ViewChild('nativeCb') inputEl: ElementRef;

  onTouched: () => any = () => { };

  private _controlValueAccessorChangeFn: (value: any) => void = (value) => { };
  private _unlisteners: Map<string, UnlistenerMap> = new Map<string, UnlistenerMap>();

  private _mdcAdapter: MDCCheckboxAdapter = {
    addClass: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      renderer.addClass(root.nativeElement, className);
    },
    removeClass: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      renderer.removeClass(root.nativeElement, className);
    },
    registerAnimationEndHandler: (handler: EventListener) => {
      if (this._root) {
        this.listen_('animationend', handler);
      }
    },
    deregisterAnimationEndHandler: (handler: EventListener) => {
      this.unlisten_('animationend', handler);
    },
    registerChangeHandler: (handler: EventListener) => {
      if (this._root) {
        this.listen_('change', handler, this.inputEl);
      }
    },
    deregisterChangeHandler: (handler: EventListener) => {
      this.unlisten_('change', handler);
    },
    getNativeControl: () => {
      return this.inputEl.nativeElement;
    },
    forceLayout: () => {
      if (this._root) {
        return this._root.nativeElement.offsetWidth;
      }
    },
    isAttachedToDOM: () => Boolean(this._root)
  };

  private _foundation: {
    init: Function,
    destroy: Function
  } = new MDCCheckboxFoundation(this._mdcAdapter);

  constructor(
    private _renderer: Renderer2,
    private _root: ElementRef) {
    this.ripple = new Ripple(this._renderer, this._root);
  }

  ngAfterViewInit() {
    this._foundation.init();
    this.ripple.unbounded = true;

    formField_ = new MDCFormField(this._root.nativeElement.parentElement);
    formField_.input = this;
    this._renderer.setAttribute(formField_.label_, 'for', this.inputId);
  }
  ngOnDestroy() {
    this._foundation.destroy();
  }

  handleChange(evt: Event) {
    evt.stopPropagation();
    this._controlValueAccessorChangeFn((<any>evt.target).checked);
    this.change.emit(evt);
  }

  writeValue(value: any) {
    this.checked = !!value;
  }

  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  listen_(type: string, listener: EventListener, ref: ElementRef = this._root) {
    if (!this._unlisteners.has(type)) {
      this._unlisteners.set(type, new WeakMap<EventListener, Function>());
    }
    const unlistener = this._renderer.listen(ref.nativeElement, type, listener);
    this._unlisteners.get(type).set(listener, unlistener);
  }

  unlisten_(type: string, listener: EventListener) {
    if (!this._unlisteners.has(type)) {
      return;
    }
    const unlisteners = this._unlisteners.get(type);
    if (!unlisteners.has(listener)) {
      return;
    }
    unlisteners.get(listener)();
    unlisteners.delete(listener);
  }
}