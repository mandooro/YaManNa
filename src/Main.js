import React from 'react';
import './Main.scss';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';
import { fire, getFireDB } from './shared/firebase';

const styles = {
  root: {
    flexGrow: 1,
    backgroundColor: 'purple',
    color: 'white',
    width: '100%',
    height: '100%',
  },
  paper: {
    textAlign: 'center',
    backgroundColor: 'purple',
  },
};

class Main extends React.Component {
  constructor() {
    super();
    fire();
  }

  componentDidMount() {
    const goSpotPage = (lat, lon) => {
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

    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude; // 위도
          const lon = position.coords.longitude; // 경도
          goSpotPage(lat, lon);
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        },
      );
    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      // 일단 카카오 본사로 찍고 스팟 보냄
      goSpotPage(33.450701, 126.570667);
    }
  }

  render() {
    // TODO 디자인 필요
    return (
      <Container fixed className={this.props.classes.root}>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={this.props.classes.paper}>
                <CircularProgress color="primary" />
              </Paper>
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={6}>
              <Paper className={this.props.classes.paper}>
                <div>준비 중입니다</div>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(Main);
