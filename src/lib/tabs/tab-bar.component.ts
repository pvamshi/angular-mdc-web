import {
	Component,
	HostBinding,
	ElementRef,
	Renderer2,
	AfterViewInit,
	QueryList,
	ContentChildren,
} from '@angular/core';
import { MDCTabBarAdapter } from './tab-bar-adapter';
import { TabDirective } from "tabs/tab.directive";

type UnlistenerMap = WeakMap<EventListener, Function>;
const MDC_TABS_STYLES = require('@material/tabs/mdc-tabs.scss');

@Component({
	selector: 'mdc-tab-bar',
	template: '<ng-content></ng-content>',
	styles: [String(MDC_TABS_STYLES)]
})
export class TabBarComponent {

	@ContentChildren(TabDirective) _tabs: QueryList<TabDirective>;

	@HostBinding('class.mdc-tab-bar') className: string = 'mdc-tab-bar';

	constructor(private _renderer: Renderer2, private _root: ElementRef) { }

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
			const { _root: root } = this;
			return root.nativeElement.offsetWidth || 0;
		},
		getNumberOfTabs: () => {
			const { _tabs: tabs } = this;
			return tabs.length;
		},
		isTabActiveAtIndex: (index: number) => {
			const _activeTabIndex = this.getActiveIndex_();
			return _activeTabIndex === index;
		},
		setTabActiveAtIndex: (index: number, isActive: boolean = true) => {
			/** TODO: Handle isActive is false */
			const { _tabs: tabs, getActiveIndex_: getActiveIndex } = this;
			const _activeTabIndex = getActiveIndex();
			if (_activeTabIndex === index) {
				return;
			}
			tabs[index].active = true;
		}
	};
	// bindOnMDCTabSelectedEvent: () => void;
	// unbindOnMDCTabSelectedEvent: () => void;
	// setStyleForIndicator: ( propertyName: string, value: string ) => void;
	// getOffsetWidthForIndicator: () => number;
	// notifyChange: ( evtData: {activeTabIndex: number} ) => void;

	private getActiveIndex_(): number {
		const { _tabs: tabs } = this;
		let activeTabIndex = -1;
		for (let index = 0; index < tabs.length; index++) {
			if (tabs[index].active) {
				activeTabIndex = index;
				break;
			}
		}
		return activeTabIndex;
	}

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
