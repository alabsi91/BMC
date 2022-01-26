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

function addClass(className) {
  if (NodeList.prototype.isPrototypeOf(this)) {
    for (let n = 0; n < this.length; n++) {
      this[n].classList.add(className);
    }
  } else {
    this.classList.add(className);
  }
}

function removeClass(className) {
  if (NodeList.prototype.isPrototypeOf(this)) {
    for (let n = 0; n < this.length; n++) {
      this[n].classList.remove(className);
    }
  } else {
    this.classList.remove(className);
  }
}
export default function initializeEasyCss() {
  HTMLElement.prototype.css = css;
  HTMLElement.prototype.removeCss = removeCss;
  HTMLElement.prototype.getCss = getCss;
  HTMLElement.prototype.addClass = addClass;
  HTMLElement.prototype.removeClass = removeClass;

  Element.prototype.css = css;
  Element.prototype.removeCss = removeCss;
  Element.prototype.getCss = getCss;
  Element.prototype.addClass = addClass;
  Element.prototype.removeClass = removeClass;

  NodeList.prototype.css = css;
  NodeList.prototype.removeCss = removeCss;
  NodeList.prototype.addClass = addClass;
  NodeList.prototype.removeClass = removeClass;
}
