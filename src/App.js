import React from 'react';
import { Route,BrowserRouter } from 'react-router-dom';
import MapPage from './MapPage'
import Main from './Main'

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route exact={true} path="/" component={Main}/>
                <Route path="/spot/:id" component={MapPage}/>
            </BrowserRouter>
        );
    }
}

export default App;
