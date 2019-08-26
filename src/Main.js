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
import FaceIcon from '@material-ui/icons/Face';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Cancel';
import queryString from 'query-string';
import SearchBar from './SearchBar';
import ManduroImage from './images/manduro.png';


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
  titleMargin: {
    flexGrow: 1,
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  colorGrey: {
    color: theme.palette.grey[700],
    backgroundColor: 'transparent',
  },
  list: {
    color: theme.palette.grey[700],
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
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
  emptyButton: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
});

class Main extends React.Component {
  state = {
    circularProgress: false,
    members: [],
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { location: { search } } = this.props;
    if (search.length > 0) {
      const parsedQuery = queryString.parse(search);
      const name = parsedQuery.name.split(',');
      const place = parsedQuery.place.split(',');
      const x = parsedQuery.x.split(',');
      const y = parsedQuery.y.split(',');

      const arrLen = name.length;
      const pointArr = [];
      for (let i = 0; i < arrLen; i += 1) {
        const obj = {
          name: name[i],
          place_name: place[i],
          x: x[i],
          y: y[i],
        };
        pointArr.push(obj);
      }

      this.setState({
        members: pointArr,
      });
    }
  }

  goSpot = () => {
    const { history } = this.props;
    const { members } = this.state;
    if (members.length > 0) {
      const xs = members.map(v => v.x).reduce((p, v) => `${p},${v}`);
      const ys = members.map(v => v.y).reduce((p, v) => `${p},${v}`);
      const placeNames = members.map(v => (v.place_name ? v.place_name : v.address_name)).reduce((p, v) => `${p},${v}`);
      const names = members.map(v => v.name).reduce((p, v) => `${p},${v}`);
      history.push(`/spot?x=${xs}&y=${ys}&place=${placeNames}&name=${names}&count=1&category=0&select=0`);
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


  addList = (item) => {
    const { members } = this.state;
    this.setState({
      members: members.concat(item),
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
                        <Chip icon={<FaceIcon />} label={`${value.name}`} color="primary" className={classes.chip} />
                        <Chip label={`${place}`} color="primary" variant="outlined" className={classes.chip} />
                        <ListItemSecondaryAction>
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
              <Grid item xs={12} onClick={this.openDialaog} className={classes.titleMargin}>
                <SearchBar addList={item => this.addList(item)} memberLen={members.length + 1} />
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
