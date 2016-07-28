# Zebkit for TypeScript

![ScreenShot](http://repo.zebkit.org/zebkit.logo.png)

This library is a port of [zebkit](https://github.com/barmalei/zebkit) also known as [zebra](http://www.zebkit.org/).
Documentation can be found [here](http://www.zebkit.org/documentation/)

## Install

`npm install kristianmandrup/zebkit --save`

## Usage

TODO

## Architecture

This library is based on [zebkit](https://github.com/barmalei/zebkit) but split up into ES6 modules and classes, with the 
addition of TypeScript types and other fabolous magic!

Furthermore, the library is divided into logocial packages which in time will live as their own npm modules so you can pick and choose the parts
of the library you need for your scenario. The main packages (folders) are:

- data
- io
- layout
- ui
- utils
- web

These packages map directly to the original package structure of zebkit. In the near future, we will try to re-structure to achieve an
architecture more like:

- core
- io
- layout
- ui
  - core
  - date
  - designer
  - field
  - grid
  - html
  - list
  - spin
  - toolbar
  - tree
  - views
  - keyboard
  - web
  - window

The idea is that you should be able to run zebkit using a minimal set of packages for your needs, such as:

- ui.core
- ui.field
- layout

These modules will then automatically reference the zebkit `core` module as well.
This will make it much easier to maintain down the road and the community can easily add their own modules in a very flexible way
and not rely on the full library.

## TypeScript via ES5

```js
pkg.Line = Class(pkg.Panel, [
    // constructor?
    function() {
        this.$super();

        if (arguments.length > 0) {
            this.setColors.apply(this, arguments);
        }
    },

    // prototype constructor?
    function $prototype(colors) {
        this.colors = colors ? colors : [ "gray" ];

        // ...
 
        this.calcPreferredSize = function(target) {
            var s = this.colors.length * this.lineWidth;
            return { width: s, height:s};
        };
    }

    // more methods
}

```

Much more elegant, simplified and intuitive with TypeScript

```js
import Panel from './core/Panel';

export default class Line extends Panel {
    lineWidth: number;

    constructor(public colors: string[]) {
        super();
        this.colors = colors || [ "gray" ];
        // ...
    }

    // more methods

    calcPreferredSize(target) {
        let s = this.colors.length * this.lineWidth;
        return { width: s, height:s};
    }
}    
```

## License

MIT


