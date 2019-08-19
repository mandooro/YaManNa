import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { purple, orange, red, grey } from '@material-ui/core/colors';
import MapPage from './MapPage';
import SpotPage from './SpotPage';
import Main from './Main';

const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: purple,
    third: grey,
  },
  status: {
    danger: orange[500],
  },
});

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Route exact path="/" component={Main} />
          <Route exact path="/spot" component={SpotPage} />
          <Route path="/spot/:id" component={MapPage} />
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
