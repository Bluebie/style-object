// very simple object, which, when converted to a string, turns in to a css inline style representation of itself
// if a value is set to a function, the function will be executed every time the style is converted to string
const inlineStyle = require('inline-style')

class StyleObject {
  /** create a style object, optionally with initial values (similar to calling .set())
   * @param {Object} initial - initial values to assign to the style object
   */
  constructor(initial) {
    if (initial) {
      this.set(initial)
    }
  }

  /** set a bunch of css properties from a JSON-like object
   * @params {Object} obj
   */
  set(obj) {
    Object.entries(obj).forEach(([key, value])=> this[key] = value)
  }

  /** set CSS variables (with -- prefix added) in bulk, like .set() but prefixes keys with --
   * @params {Object} obj
   */
  setVariables(obj) {
    Object.entries(obj).forEach(([key, value])=> this[`--${key}`] = value)
  }

  /** returns a string which can be used for inline html rendering server side or in nanohtml
   * @returns {String}
   */
  toString() {
    return inlineStyle(this.values())
  }
  
  /** returns an object with all functions resolved to concrete values for this moment
   * @returns {Object}
   */
  values() {
    let entries = Object.entries(this)
    return Object.fromEntries(entries.map(([key, value])=> {
      if (typeof(value) == 'function') value = value()
      if (Array.isArray(value)) value = value.filter(x => x !== null).join(', ')
      return [key, value]
    }).filter(([key, value])=> value !== undefined && value !== null))
  }

  /** update an element with the styles
   * @param {Element} element - a DOM element to update
   */
  updateElement(element) {
    Object.assign(element.style, this.values())
  }
}

module.exports = StyleObject
