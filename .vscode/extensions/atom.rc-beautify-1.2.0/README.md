<div align="center">
    <a href="https://github.com/hatedMe/rc-beautify">
        <img src="https://github.com/hatedMe/rc-beautify/raw/master/res/logo.png">
    </a>
    <h1>Beautify React Javascript TypeScript</h1>
    <div>
        <a href="https://marketplace.visualstudio.com/items?itemName=Atom.rc-beautify#qna">
            <img src="https://img.shields.io/vscode-marketplace/v/Atom.rc-beautify.svg?style=flat-square" />
        </a>
        <a href="https://marketplace.visualstudio.com/items?itemName=Atom.rc-beautify#qna">
            <img src="https://img.shields.io/vscode-marketplace/r/Atom.rc-beautify.svg?style=flat-square" />
        </a>
        <a href="https://marketplace.visualstudio.com/items?itemName=Atom.rc-beautify#qna">
            <img src="https://img.shields.io/vscode-marketplace/d/Atom.rc-beautify.svg?style=flat-square" />
        </a>
    </div>
    <p>A plugin for beautifying react.js in vscode</p>
</div>

## rc-beautify
> This extension wraps prettydiff to format your javascript, JSX, typescript, TSX file.

## How To Use?
- shortcuts: Ctrl+B
- Press F1, enter Beautify React Javascript TypeScript

## Manifest

> It works for my main use case and I hope it works for you too.

So this plugin will turn this:

```javascript
import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import {
    connect
} from 'react-redux';

class App extends Component {
render() {
return (
<div>
<h1>hello word</h1>
</div>
)
}
}


export default connect()(App)
```
into:
```javascript
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class App extends Component {
    render() {
        return (
            <div>
                <h1>hello word</h1>
            </div>
        )
    }
}

function name() {
    console.log(456);
}

export default connect()(App)
```
<p><img src="https://github.com/hatedMe/rc-beautify/raw/master/res/test.rc-beautify.gif" /></p>

## Setting 
changge a global settings:
> This plugin basically helps you to configure the settings, but you want to change more interesting settings, and the author will slowly update it (though I'm not lazy, hehe =。= )
```javascript
{
    "insize": 4,
    "inchar": " ",
    "bracepadding": false,
    "wrap": 80
}
 ```
