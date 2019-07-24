import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/styles';
import { getFireDB } from './shared/firebase';

const styles = theme => ({
  root: {
    flexGrow: 1,
    color: 'white',
    width: '100%',
    height: '100%',
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
});

class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  componentDidMount() {
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
  }

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

  render() {
    const { classes } = this.props;
    return (
      <Typography component="div">
        <Container fixed>
          <div>
            <Grid
              container
              spacing={4}
              direction="row"
              justify="center"
              alignItems="center"
              className={classes.center}
            >
              <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                  <CircularProgress color="primary" />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                  <Box>SPOT 생성 중입니다...</Box>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Container>
      </Typography>
    );
  }
}


export default withStyles(styles)(Main);
