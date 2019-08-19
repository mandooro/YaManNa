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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import SubwayIcon from '@material-ui/icons/Subway';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchBar from './SearchBar2';
import ManduroImage from './images/manduro.png';
import { getFireDB } from './shared/firebase';


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
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    textAlign: 'left',
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
    textAlign: 'center',
  },
  colorGrey: {
    color: theme.palette.grey[700],
    backgroundColor: 'transparent',
  },
  list: {
    color: theme.palette.grey[700],
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  icon: {
    color: theme.palette.primary.main,
  },
  chip: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordWrap: 'normal',
    maxWidth: '200px',
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    position: 'fixed',
    bottom: '0px',
    fontSize: '20px',
  },
});

class Main extends React.Component {
  state = {
    circularProgress: false,
    members: [
      {
        name: '이윤규', place_name: '고려대학교 서울캠퍼스', address_name: '서울특별시 송파구 잠실동 204-5', x: '127.031685000726', y: '37.5898422803883',
      },
      {
        name: '임해인', address_name: '서울 동대문구 제기동 148-6', x: '127.03103903252514', y: '37.58298409427197',
      },
    ],
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

  goSpot = () => {
    const { history } = this.props;
    const { members } = this.state;
    if (members.length > 0) {
      const xs = members.map(v => v.x).reduce((p, v) => `${p},${v}`);
      const ys = members.map(v => v.y).reduce((p, v) => `${p},${v}`);
      const placeNames = members.map(v => (v.place_name ? v.place_name : v.address_name)).reduce((p, v) => `${p},${v}`);
      const names = members.map(v => v.name).reduce((p, v) => `${p},${v}`);
      history.push(`/spot?x=${xs}&y=${ys}&place=${placeNames}&name=${names}`);
    } else {
      alert('적어도 한명 이상의 멤버를 설정해주세요!');
    }
  }

  deleteItem = (i) => {
    const { members } = this.state;
    this.setState({
      members: members.filter((v, index) => i !== index),
    });
  }

  render() {
    const { classes } = this.props;
    const { circularProgress, members } = this.state;
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
              spacing={1}
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                  <Typography variant="h3" gutterBottom>
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
                <List className={classes.list}>
                  {members.map((value, i) => {
                    const place = value.place_name ? value.place_name : value.address_name;
                    return (
                      <ListItem key={i.toString()} dense button>
                        <Chip label={`${value.name}`} color="primary" className={classes.chip} />
                        <Chip label={`${place}`} color="primary" variant="outlined" className={classes.chip} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="subway">
                            <SubwayIcon className={classes.icon} />
                          </IconButton>
                          <IconButton edge="end" aria-label="subway" onClick={() => this.deleteItem(i)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} onClick={this.openDialaog} className={classes.title}>
                <SearchBar />
              </Grid>
            </Grid>
          </div>
          <Button variant="contained" color="primary" className={classes.button} onClick={this.goSpot}>
            중간 지점 찾기
          </Button>
        </Container>
      </Typography>
    );
  }
}


export default withStyles(styles)(Main);
