import {
	Component,
	HostBinding,
	ElementRef,
	Renderer2,
} from '@angular/core';
import { MDCTabBarAdapter } from './tab-bar-adapter';

type UnlistenerMap = WeakMap<EventListener, Function>;
const MDC_TABS_STYLES = require('@material/tabs/mdc-tabs.scss');

interface Tab {
	name: string;
	href: string;
}

@Component({
	selector: 'mdc-tab-bar',
	template: '<ng-content></ng-content>',
	styles: [String(MDC_TABS_STYLES)]
})
export class TabBarComponent {

	@HostBinding('class.mdc-tab-bar') className: string = 'mdc-tab-bar';

	constructor(private _renderer: Renderer2, private _root: ElementRef) { }

	private _tabs: Tab[] = [
		{ name: 'tab 1', href: '#' },
		{ name: 'tab 2', href: '#' },
		{ name: 'tab 3', href: '#' },
		{ name: 'tab 4', href: '#' },
	];
	private _activeTabIndex: number = 0;
	private _unlisteners: Map<string, UnlistenerMap> = new Map<string, UnlistenerMap>();

	private _mdcTabBarAdaptor: MDCTabBarAdapter = {
		addClass: (className: string) => {
			const { _renderer: renderer, _root: root } = this;
			renderer.addClass(root.nativeElement, className);
		},
		removeClass: (className: string) => {
			const { _renderer: renderer, _root: root } = this;
			renderer.removeClass(root.nativeElement, className);
		},
		registerResizeHandler: (handler: EventListener) => {
			const { _renderer: renderer, _root: root } = this;
			if (this._root) {
				this.listen_('resize', handler, renderer.parentNode(root.nativeElement));
			}
		},
		deregisterResizeHandler: (handler: EventListener) => {
			this.unlisten_('resize', handler);
		},
		getOffsetWidth: () => {
			const {_root: root} = this;
			return root.nativeElement.offsetWidth || 0;
		},
		getNumberOfTabs: () => {
			const { _tabs: tabs} = this;
			return tabs.length;
		},
		isTabActiveAtIndex: (index: number) => {
			const { _activeTabIndex: activeTabIndex} = this;
			return activeTabIndex === index;
		},
		setTabActiveAtIndex: (index: number, isActive: boolean = true) => {
      //TOOD:
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
	// addClass: (className: string ) => boolean;
	// removeClass: (className: string ) => void;
	// bindOnMDCTabSelectedEvent: () => void;
	// unbindOnMDCTabSelectedEvent: () => void;
	// registerResizeHandler: (handler: EventListener ) => void;
	// deregisterResizeHandler: ( handler: EventListener ) => void;
	// getOffsetWidth: () => number;
	// setStyleForIndicator: ( propertyName: string, value: string ) => void;
	// getOffsetWidthForIndicator: () => number;
	// notifyChange: ( evtData: {activeTabIndex: number} ) => void;
	// getNumberOfTabs: () =>  number ;
	// isTabActiveAtIndex: ( index: number ) =>  boolean ;
}
