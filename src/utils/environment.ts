export const isInBrowser = typeof navigator !== "undefined";
export const isIE        = isInBrowser && (Object.hasOwnProperty.call(window, "ActiveXObject") || !!window.ActiveXObject);
export const isFF        = isInBrowser && window.mozInnerScreenX != null;

export const isMacOS = isInBrowser && navigator.platform.toUpperCase().indexOf('MAC') !== -1;

export const $global    = (typeof window !== "undefined" && window != null) ? window : this;