export function getNumericStyleProperty(style, prop) {
  return parseInt(style.getPropertyValue(prop), 10)
}

/**
 * Returns the currently set browser minimum font size. We create an invisible element and set its font-size
 * style to 1px. We then obtain the browser's computed font-size property, which should be the minimum size
 * allowed by the browser's current settings. TODO is there a better way to get the browser minimum font size?
 */
export function detectMinFontSize() {
  let elem = document.createElement('div')
  elem.style['font-size'] = '1px'
  elem.style.display = 'none'
  elem.style.visibility = 'hidden'
  document.body.appendChild(elem)
  let style = getComputedStyle(elem, null)
  let size = Number(style.getPropertyValue('font-size').match(/(\d*(\.\d*)?)px/)[1])
  document.body.removeChild(elem)
  return size
}

/**
 * Returns the position of an element relative to the page, or until a parent element for which the provided
 * 'until' function is truthy. Basic implementation from http://stackoverflow.com/a/5776220/430128.
 * @param elem
 * @param until A function, if provided, is passed each parent element and computed style. If it returns a
 *   truthy value, the returned position will be relative to that element.
 * @returns {{x: number, y: number}}
 */
export function elementPosition(elem, until) {
  let x = 0
  let y = 0
  let inner = true

  while (elem) {
    let style = getComputedStyle(elem, null)
    if(until && until(elem, style)) break
    x += elem.offsetLeft
    y += elem.offsetTop
    y += getNumericStyleProperty(style, 'border-top-width')
    x += getNumericStyleProperty(style, 'border-left-width')
    if (inner) {
      y += getNumericStyleProperty(style, 'padding-top')
      x += getNumericStyleProperty(style, 'padding-left')
    }
    inner = false
    elem = elem.offsetParent
  }
  return {x: x, y: y}
}

/**
 * Returns the number of pixels to scroll the window by (in the x and y directions) to make an element completely
 * visible within the viewport.
 * @param el The element
 * @param xGutter
 * @param yGutter
 * @return {{xDelta: number, yDelta: number}}
 */
export function scrollByToVisible(el, xGutter, yGutter) {
  let rect = el.getBoundingClientRect()
  let xDelta = 0
  let yDelta = 0
  xGutter = xGutter || 0
  yGutter = yGutter || 0

  let windowWidth = document.documentElement.clientWidth || document.body.clientWidth
  if(rect.right < xGutter) xDelta = rect.right - xGutter
  else if(rect.left > windowWidth - xGutter) xDelta = rect.left - windowWidth + xGutter

  let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
  if(rect.top < yGutter) yDelta = rect.top - yGutter
  else if(rect.bottom > windowHeight - yGutter) yDelta = rect.bottom - windowHeight + yGutter

  return {
    xDelta: xDelta,
    yDelta: yDelta
  }
}
