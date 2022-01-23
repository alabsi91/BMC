function css(styles) {
  if (NodeList.prototype.isPrototypeOf(this)) {
    for (let n = 0; n < this.length; n++) {
      for (let key in styles) {
        let value = styles[key];
        this[n].style[key] = value;
      }
    }
  } else {
    for (let key in styles) {
      let value = styles[key];
      this.style[key] = value;
    }
  }
}

function removeCss(styles) {
  if (NodeList.prototype.isPrototypeOf(this)) {
    for (let n = 0; n < this.length; n++) {
      if (Array.isArray(styles)) {
        for (let i = 0; i < styles.length; i++) {
          const element = styles[i];
          this[n].style.removeProperty(element);
        }
      } else {
        this[n].style.removeProperty(styles);
      }
    }
  } else {
    if (Array.isArray(styles)) {
      for (let i = 0; i < styles.length; i++) {
        const element = styles[i];
        this.style.removeProperty(element);
      }
    } else {
      this.style.removeProperty(styles);
    }
  }
}

function getCss(prop, toNum = false) {
  if (toNum) {
    return parseInt(window.getComputedStyle(this).getPropertyValue(prop));
  } else {
    return window.getComputedStyle(this).getPropertyValue(prop);
  }
}

export default function initializeEasyCss() {
  HTMLElement.prototype.css = css;
  HTMLElement.prototype.removeCss = removeCss;
  HTMLElement.prototype.getCss = getCss;

  Element.prototype.css = css;
  Element.prototype.removeCss = removeCss;
  Element.prototype.getCss = getCss;

  NodeList.prototype.css = css;
  NodeList.prototype.removeCss = removeCss;
}
