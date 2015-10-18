import React from 'react';
import {Route} from 'react-router';
import App from './components/app';
import Gallery from './components/gallery';

export default (
    <Route path="/" component={App}>
        <Route path="/gallery/:name" component={Gallery}/>
    </Route>
);