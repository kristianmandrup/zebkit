# Zebkit for TypeScript

![ScreenShot](http://repo.zebkit.org/zebkit.logo.png)

This library is a port of [zebkit](https://github.com/barmalei/zebkit) also known as [zebra](http://www.zebkit.org/).
Documentation can be found [here](http://www.zebkit.org/documentation/)

## Install

`npm install kristianmandrup/zebkit --save`

## Usage

The original zebkit is used as described in this [Getting started tutorial](http://www.zebkit.com/start-in-5-minutes/)
We imagine the new ES6 version of Zebkit will be used something like this:

```js
zebkit.loadConfig((config) => {
  // override default loading of config file
});

import zebkit from 'zebkit';
const BorderLayout = zebkit.layout.BorderLayout;
const { TextField, Button } = zebkit.ui.controls;
const { Border } = zebkit.ui.views;

// initialize
zebkit.init().then((z) => {
    // create canvas
    const canvas = document.querySelector('#myCanvas')
    const root = new zCanvas(canvas, {width: 400, height: 400}).root;
    root.properties({
        layout : new BorderLayout({
            gaps: {
                horizontal: 8
                vertical: 8
            }
        }),
        border : new Border(),
        padding: 8,
        kids: {
            center: new TextField("Hi ...\n", {maxLength: 15}),
            bottom: new Button("Clear", { 
                canHaveFocus: false
            })
        }
    });    
};
```

Notice the much clearer API using option Objects instead of positional arguments.

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
 
        this.setColors = function() {
            this.colors = (arguments.length === 1) ? (Array.isArray(arguments[0]) ? arguments[0].slice(0)
                                                                                  : [ arguments[0] ] )
                                                   : Array.prototype.slice.call(arguments);
            this.repaint();
            return this;
        };

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

    setColors(...colors) {
        this.colors = colors;
        this.repaint();
        return this;
    }

    calcPreferredSize(target) {
        let s = this.colors.length * this.lineWidth;
        return { width: s, height:s};
    }
}    
```

Notice the use of rest parameters in setColors. We can also use destructuring to great effect!

```js
function paint(g,x,y,w,h,d) {
    ...
}
```

Instead we pass as more logical tuples such as x/y width/height etc. 

```js
function paint(g,{x : number, y : number, w : number,h : number},d : number) {
    ...
}
```

We can further improve by using interfaces

```js
interface coords {
    x: number;
    y: number
} 

interface size {
    width: number;
    height: number
} 

function paint(g, coords, size, d) {
    ...
}

panel.paint(g, newPos, newSize, d);
```

So much better!

## JavaScript compatibility

You can still code using good old ES5 or ES6 etc. TypeScript can interoperate seamlessly with normal Javascript.
Write your code in any flavour of JavaScript or TypeScript that you like. ES5 is also valid TypeScript! 
You just wont get all the benefits of static typing and code assist which TypeScript provides, which is a 
huge win IMO!!

## License

MIT


