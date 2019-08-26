import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  purple, orange, red, grey, yellow, pink, indigo, blueGrey,
} from '@material-ui/core/colors';
import SpotPage from './SpotPage';
import Main from './Main';

const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: blueGrey,
    third: grey,
  },
  status: {
    danger: orange[500],
    kakao: '#ffe812',
  },
});

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Route exact path="/" component={Main} />
          <Route exact path="/spot" component={SpotPage} />
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
