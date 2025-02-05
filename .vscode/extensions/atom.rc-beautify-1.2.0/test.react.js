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