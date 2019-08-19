import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/styles';
import { getFireDB } from './shared/firebase';
import ManduroImage from './images/manduro.png';
import SearchBar from './SearchBar2';

const styles = theme => ({
  root: {
    flexGrow: 1,
    color: 'white',
    width: '100%',
    height: '100%',
  },
  marginPaddingZero: {
    margin: 0,
    padding: 0,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  center: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(0, -50%)',
    width: '100%',
  },
  manduroBox: {
    backgroundImage: `url(${ManduroImage})`,
    height: '500px',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
  },
  centerText: {
    position: 'absolute',
    bottom: '42%',
    right: '50%',
    transform: 'translate(50%, 50%)',
    width: '300px',
  },
  centerButton: {
    position: 'absolute',
    bottom: '40%',
    right: '50%',
    transform: 'translate(50%, 50%)',
    padding: '5px 10px',
  },
  centerProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100,
  },
  title: {
    flexGrow: 1,
  },
  colorGrey: {
    color: theme.palette.grey[700],
    backgroundColor: 'transparent',
  },
});

class Main extends React.Component {
  state = {
    circularProgress: false,
    searchDialog: false,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  handleClick = () => {
    this.setState({
      circularProgress: true,
    });
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude; // 위도
          const lon = position.coords.longitude; // 경도
          this.goSpotPage(lat, lon);
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        },
      );
    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      // 일단 카카오 본사로 찍고 스팟 보냄
      this.goSpotPage(33.450701, 126.570667);
    }
  };

  goSpotPage = (lat, lon) => {
    getFireDB().ref().push({ master: { lat, lon } })
      .then((result) => {
        const { key } = result;
        window.localStorage.setItem(key, 'master');
        const { history } = this.props;
        history.push(`/spot/${key}`);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  openDialaog = () => {
    this.setState({
      searchDialog: true,
    });
  }

  render() {
    const { classes } = this.props;
    const { circularProgress } = this.state;
    return (
      <Typography component="div">
        {
          circularProgress && <Box className={classes.centerProgress}><CircularProgress color="primary" /></Box>
        }
        <Container fixed className={classes.marginPaddingZero}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                야만나
              </Typography>
            </Toolbar>
          </AppBar>
          <div>
            <Grid
              container
              spacing={4}
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                  <Typography variant="h2" gutterBottom onClick={this.handleClick}>
                    <Box>
                      야
                      <Paper elevation={0} className={classes.colorGrey}>
                        중간에서
                      </Paper>
                      만나
                    </Box>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} onClick={this.openDialaog}>
                <SearchBar />
              </Grid>
            </Grid>
          </div>
        </Container>
      </Typography>
    );
  }
}


export default withStyles(styles)(Main);
