# style-object
A simple way to make inline styles as objects, with optional render functions, for use with nanohtml/lit-html style of widget rendering. It can be useful when working with nanocomponent or lit-html/nanohtml html rendering workflows, to generate stringified css inline styles.

a StyleObject works pretty much like a regular javascript object, with a few differences:

* When .toString() is called, it returns a nicely formatted css inline styles string, suitable for use in a DOM style attribute.
* camelCasePropertyNames are stringified in-hyphenated-lowercase
* when values are functions, the function is called every time toString() is called, and it's return value is used when building the string
* a .setVariables() method makes it easier to add custom variables (prefixing property names with --)
* a .set() method makes it easy to bulk override several properties in the object

This can be useful when using nanocomponent, as you can tie css property values to object instance properties and other dynamic data in the object's constructor, and you can expose a .style property allowing users to manipulate the styles of the widget similar to a DOM element, and you can avoid messy inline style building template code in your createElement / rendering functions.

## Example usage with NanoComponent:

```js
const Nanocomponent = require('nanocomponent')
const html = require('nanohtml')

class ButtonWidget extends Nanocomponent {
  constructor ({ label = 'Button', onClick = () => {}, fontSize = '12pt', hue = 0 }) {
    super()
    this.label = label
    this.onClick = onClick
    this.fontSize = '12pt'
    this.hue = hue
    this.style = new StyleObject({
      fontSize: () => this.fontSize,
      backgroundColor: () => `hsl(${this.hue}deg, 30%, 90%)`,
      color: () => `hsl(${this.hue}deg, 80%, 10%)`,
      border: () => `hsl(${this.hue}deg, 50%, 20%)`
    })
  }
  
  createElement () {
    let click = (event) => this.onClick(event)
    return html`<button style="${this.style}" onclick=${click}>${this.label}</button>`
  }
  
  update () {
    return true
  }
}

module.exports = ButtonWidget 
```

In the above example, a simple button can be configured with .style similar to a DOM element, except that calling .render() after is required to make the changes take effect. Code stays pretty clean, and properties on the object can be used to generate complex styles programatically, like the hue option above.
