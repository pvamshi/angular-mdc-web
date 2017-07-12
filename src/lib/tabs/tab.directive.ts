import {
  Directive,
  HostBinding,
  Input,
  Renderer2,
  ElementRef,
  EventEmitter,
} from '@angular/core';
import { MDCTabAdapter } from './tab-adapter';

type UnlistenerMap = WeakMap<EventListener, Function>;
@Directive({
  selector: '[mdc-tab]'
})
export class TabDirective {
  private _active = false;

  @Input() set active(active) {
    this._active = active;
  }

  get active(): boolean {
    return this._active;
  }

  @HostBinding('class.mdc-tab') className: string = 'mdc-tab';
  @HostBinding('class.mdc-tab--active') get activeClassName(): string {
    return this.active ? 'mdc-tab--active' : '';
  }
  private _unlisteners: Map<string, UnlistenerMap> = new Map<string, UnlistenerMap>();

  constructor(private _renderer: Renderer2, private _root: ElementRef) { }
  private _mdcTabAdapter: MDCTabAdapter = {
    addClass: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      renderer.addClass(root.nativeElement, className);
    },
    removeClass: (className: string) => {
      const { _renderer: renderer, _root: root } = this;
      renderer.removeClass(root.nativeElement, className);
    },
    registerInteractionHandler: (type: string, handler: EventListener) => {
      if (this._root) {
        this.listen_(type, handler, this._root.nativeElement);
      }
    },
    deregisterInteractionHandler: (type: string, handler: EventListener) => {
      this.unlisten_(type, handler);
    },
    getOffsetWidth: () => {
      const { _root: root } = this;
      return root.nativeElement.offsetWidth || 0;
    },
    getOffsetLeft: () => {
      const { _root: root } = this;
      return root.nativeElement.getOffsetLeft || 0;
    },
    notifySelected: () => {
      /** TODO: implement notifySelected */
    }
  };

  private listen_(type: string, listener: EventListener, ref: any) {
    if (!this._unlisteners.has(type)) {
      this._unlisteners.set(type, new WeakMap<EventListener, Function>());
    }
    const unlistener = this._renderer.listen(ref, type, listener);
    this._unlisteners.get(type).set(listener, unlistener);
  }

  private unlisten_(type: string, listener: EventListener) {
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
