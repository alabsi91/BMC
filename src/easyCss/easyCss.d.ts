type css = (styles: CSSStyleDeclaration) => void;
type removeCss = (styles: string[] | string) => void;
type getCss = (property: string, toNumber: boolean) => string | number;
type addClass = (className: string) => void;
type removeClass = (className: string) => void;

declare interface HTMLElement {
  /**
   * - Set multiple css properties at once.
   * - **Syntax:** `element.css({ cssProperty: value, ... })`
   */
  css: css;

  /**
   * - Remove multiple css properties at once.
   * - **Syntax:** `element.removeCss( ["css-property", ...] | "css-property" )`
   */
  removeCss: removeCss;

  /**
   * - Get a css property value as `string` or `number` .
   * - **Syntax:** `element.getCss( "css-property" , boolean )`
   */
  getCss: getCss;

  /**
   * - Add class name.
   * - **Syntax:** `element.addClass( "class-name" )`
   */
  addClass: addClass;

  /**
   * - Remove class name.
   * - **Syntax:** `element.removeClass( "class-name" )`
   */
  removeClass: removeClass;
}

declare interface Element {
  /**
   * - Set multiple css properties at once.
   * - **Syntax:** `element.css({ cssProperty: value, ... })`
   */
  css: css;

  /**
   * - Remove multiple css properties at once.
   * - **Syntax:** `element.removeCss( ["css-property", ...] | "css-property" )`
   */
  removeCss: removeCss;

  /**
   * - Get a css property value as `string` or `number` .
   * - **Syntax:** `element.getCss( "css-property" , boolean )`
   */
  getCss: getCss;

  /**
   * - Add class name.
   * - **Syntax:** `element.addClass( "class-name" )`
   */
  addClass: addClass;
  
  /**
   * - Remove class name.
   * - **Syntax:** `element.removeClass( "class-name" )`
   */
  removeClass: removeClass;
}

declare interface NodeList {
  /**
   * - Set multiple css properties at once.
   * - **Syntax:** `element.css({ cssProperty: value, ... })`
   */
  css: css;

  /**
   * - Remove multiple css properties at once.
   * - **Syntax:** `element.removeCss( ["css-property", ...] | "css-property" )`
   */
  removeCss: removeCss;

  /**
   * - Add class name.
   * - **Syntax:** `element.addClass( "class-name" )`
   */
  addClass: addClass;
  
  /**
   * - Remove class name.
   * - **Syntax:** `element.removeClass( "class-name" )`
   */
  removeClass: removeClass;
}
