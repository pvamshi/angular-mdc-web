export interface MDCTabBarAdapter {
	addClass: (className: string) => void;
	removeClass: (className: string) => void;
	// bindOnMDCTabSelectedEvent: () => void;
	// unbindOnMDCTabSelectedEvent: () => void;
	registerResizeHandler: (handler: EventListener) => void;
	deregisterResizeHandler: (handler: EventListener) => void;
	getOffsetWidth: () => number;
	// setStyleForIndicator: ( propertyName: string, value: string ) => void;
	// getOffsetWidthForIndicator: () => number;
	// notifyChange: ( evtData: {activeTabIndex: number} ) => void;
	getNumberOfTabs: () => number;
	isTabActiveAtIndex: (index: number) => boolean;
	setTabActiveAtIndex: (index: number, isActive: true ) => void;
	//isDefaultPreventedOnClickForTabAtIndex: (/* index: number */) => /* boolean */ false;
	//setPreventDefaultOnClickForTabAtIndex: (/* index: number, preventDefaultOnClick: boolean */) => {};
	//measureTabAtIndex: (/* index: number */) => {};
	//getComputedWidthForTabAtIndex: (/* index: number */) => /* number */ 0;
	//getComputedLeftForTabAtIndex: (/* index: number */) => /* number */ 0;
}
