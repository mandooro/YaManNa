import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { purple, orange, red } from '@material-ui/core/colors';
import MapPage from './MapPage';
import Main from './Main';

const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: {
      main: '#f44336',
    },
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
          <Route path="/spot/:id" component={MapPage} />
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
