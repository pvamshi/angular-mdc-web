﻿import {
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
import { MDCTextfieldAdapter } from './textfield-adapter';

const { MDCTextfieldFoundation } = require('@material/textfield');
const MDC_TEXTFIELD_STYLES = require('@material/textfield/mdc-textfield.scss');

export const MD_TEXTFIELD_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextfieldComponent),
  multi: true
};

type UnlistenerMap = WeakMap<EventListener, Function>;

@Component({
  selector: 'mdc-textfield',
  templateUrl: './textfield.component.html',
  styles: [String(MDC_TEXTFIELD_STYLES)],
  encapsulation: ViewEncapsulation.None,
  providers: [MD_TEXTFIELD_CONTROL_VALUE_ACCESSOR]
})
export class TextfieldComponent implements AfterViewInit, OnDestroy {
  private disabled_: boolean;

  @Input() id: string;
  @Input() type: string = 'text';
  @Input() value: string;
  @Input()
  get disabled(): boolean {
    return this.disabled_;
  }
  set disabled(value: boolean) {
    this.disabled_ = value;
    if (this.inputEl) {
      this._foundation.setDisabled(value);
    }
  }
  @Input() required: boolean;
  @Input() labelId: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() tabindex: number;
  @Input() rows: number;
  @Input() cols: number;
  @Input() maxlength: number;
  @Input() fullwidth: boolean;
  @Input() multiline: boolean;
  @Output() focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() input: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();
  @HostBinding('class.mdc-textfield') className: string = 'mdc-textfield';
  @HostBinding('class.mdc-textfield--multiline') get classMultiline(): string {
    return this.multiline ? 'mdc-textfield--multiline' : '';
  }
  @HostBinding('class.mdc-textfield--fullwidth') get classFullwidth(): string {
    return this.fullwidth ? 'mdc-textfield--fullwidth' : '';
  }
  @ViewChild('input') public inputEl: ElementRef;
  @ViewChild('inputlabel') public inputLabel: ElementRef;

  onTouched: () => any = () => { };

  private _controlValueAccessorChangeFn: (value: any) => void = (value) => { };
  private _unlisteners: Map<string, UnlistenerMap> = new Map<string, UnlistenerMap>();

  private _mdcAdapter: MDCTextfieldAdapter = {
    addClass: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      renderer.addClass(root.nativeElement, className);
    },
    removeClass: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      renderer.removeClass(root.nativeElement, className);
    },
    addClassToLabel: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      if (this.inputLabel) {
        if (this.label && !this.fullwidth) {
          renderer.addClass(this.inputLabel.nativeElement, className);
        }
      }
    },
    removeClassFromLabel: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      if (this.inputLabel) {
        if (this.label && !this.fullwidth) {
          renderer.removeClass(this.inputLabel.nativeElement, className);
        }
      }
    },
    addClassToHelptext: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      if (root.nativeElement.attributes.getNamedItem('aria-controls')) {
        if (root.nativeElement.nextElementSibling) {
          renderer.addClass(renderer.nextSibling(root.nativeElement), className);
        }
      }
    },
    removeClassFromHelptext: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      if (root.nativeElement.attributes.getNamedItem('aria-controls')) {
        renderer.removeClass(renderer.nextSibling(root.nativeElement), className);
      }
    },
    registerInputFocusHandler: (handler: EventListener) => {
      if (this._root) {
        this.listen_('focus', handler, this.inputEl);
      }
    },
    deregisterInputFocusHandler: (handler: EventListener) => {
      this.unlisten_('focus', handler);
    },
    registerInputBlurHandler: (handler: EventListener) => {
      if (this._root) {
        this.listen_('blur', handler, this.inputEl);
      }
    },
    deregisterInputBlurHandler: (handler: EventListener) => {
      this.unlisten_('blur', handler);
    },
    registerInputInputHandler: (handler: EventListener) => {
      if (this._root) {
        this.listen_('input', handler, this.inputEl);
      }
    },
    deregisterInputInputHandler: (handler: EventListener) => {
      this.unlisten_('input', handler);
    },
    registerInputKeydownHandler: (handler: EventListener) => {
      if (this._root) {
        this.listen_('keydown', handler, this.inputEl);
      }
    },
    deregisterInputKeydownHandler: (handler: EventListener) => {
      this.unlisten_('keydown', handler);
    },
    setHelptextAttr: (name: string, value: string) => {
      const { _renderer: renderer, _root: root } = this;
      if (root.nativeElement.attributes.getNamedItem('aria-controls')) {
        root.nativeElement.nextElementSibling ? renderer.setAttribute(root.nativeElement.nextElementSibling, name, value) : null;
      }
    },
    removeHelptextAttr: (name: string) => {
      const { _renderer: renderer, _root: root } = this;
      if (root.nativeElement.attributes.getNamedItem('aria-controls')) {
        return root.nativeElement.nextElementSibling ? renderer.removeAttribute(root.nativeElement.nextElementSibling, name) : null;
      }
    },
    helptextHasClass: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      if (root.nativeElement.attributes.getNamedItem('aria-controls')) {
        return root.nativeElement.nextElementSibling ? root.nativeElement.nextElementSibling.classList.contains(className) : false;
      }
    },
    getNativeInput: () => {
      return {
        checkValidity: () => this.inputEl.nativeElement.checkValidity(),
        value: this.value,
        disabled: (_) => this.disabled_ = _,
        badInput: this.inputEl.nativeElement.validity.badInput
      };
    }
  };

  private _foundation: {
    init: Function,
    destroy: Function,
    isDisabled: Function,
    setDisabled: Function
  } = new MDCTextfieldFoundation(this._mdcAdapter);

  constructor(private _renderer: Renderer2, private _root: ElementRef) { }

  ngAfterViewInit() {
    this._foundation.init();
  }
  ngOnDestroy() {
    this._foundation.destroy();
  }

  handleFocus(evt: FocusEvent) {
    this.focus.emit(evt);
  }

  handleBlur(evt: FocusEvent) {
    this._controlValueAccessorChangeFn((<any>evt.target).value);
    this.blur.emit(evt);
  }

  handleInput(evt: Event) {
    evt.stopPropagation();
    this._controlValueAccessorChangeFn((<any>evt.target).value);
    this.input.emit(evt);
  }

  handleKeyDown(evt: KeyboardEvent) {
    evt.stopPropagation();
    this.keydown.emit(evt);
  }

  writeValue(value: string) {
    if (value) {
      this.value = value;
      this._mdcAdapter.addClass(MDCTextfieldFoundation.cssClasses.UPGRADED);
      if (!this.fullwidth) {
        this._mdcAdapter.addClassToLabel(MDCTextfieldFoundation.cssClasses.LABEL_FLOAT_ABOVE);
      }
    }
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