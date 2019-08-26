import React from 'react';
import './Map.css';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import queryString from 'query-string';
import { getCenter, basicCenterAlorithm } from './lib/utils';

const styles = theme => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
  root: {
    flexGrow: 1,
    color: 'white',
    width: '100%',
    height: '100%',
    padding: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  icon: {
    position: 'fixed',
    right: '20px',
    bottom: '10px',
    zIndex: '10',
  },
  icon2: {
    position: 'fixed',
    left: '20px',
    bottom: '10px',
    zIndex: '10',
    padding: 10,
  },
  slider: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
  },
  returnButton: {
    position: 'fixed',
    left: '20px',
    bottom: '10px',
    zIndex: '10',
  },
});

class MapPage extends React.Component {
  state = {
    // 마커를 배열에 넣고 사용할 예정
    markers: [],
    map: null,
    categorymarkers: [],
    bounds: null,
    categoryCode: [
      {
        value: '지하철',
        code: 'SW8',
      },
      {
        value: '카페',
        code: 'CE7',
      },
      {
        value: '음식점',
        code: 'FD6',
      },
      {
        value: '문화시설',
        code: 'CT1',
      },
      {
        value: '편의점',
        code: 'CS2',
      },
      {
        value: '대형마트',
        code: 'MT1',
      },
      {
        value: '주차장',
        code: 'PK6',
      },
      {
        value: '숙박',
        code: 'AD5',
      }],
    categoryIndex: 0,
    searchSize: 1,
    findRoad: 0,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  async componentDidMount() {
    // 맵 초기화
    const el = document.getElementById('map');
    const map = await new window.kakao.maps.Map(el, {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표.
      level: 6, // 지도의 레벨(확대, 축소 정도)
    });
    this.setState({
      map,
    });
    const { location: { search } } = this.props;
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
        place: place[i],
        x: x[i],
        y: y[i],
      };
      pointArr.push(obj);
    }

    this.setMarkers(pointArr);
  }

  setMarkers = (pointArr) => {
    const { map, categoryCode } = this.state;

    const markers = pointArr.map((v) => {
      const lat = v.y;
      const lon = v.x;
      const content = `<div class ="label" style="color: #484d8b; background-color: white; padding: 5px; border: 1px solid #484d8b; border-radius: 30px;"><span class="left"></span><span class="center">${v.name}</span><span class="right"></span></div>`;
      const pointPosition = new window.kakao.maps.LatLng(lat, lon);
      const point = new window.kakao.maps.CustomOverlay({
        map, // 마커를 표시할 지도
        position: pointPosition, // 마커를 표시할 위치
        content, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
      });
      return point;
    });

    const newBounds = new window.kakao.maps.LatLngBounds();
    this.setState({
      bounds: newBounds,
    });
    markers.forEach(mark => newBounds.extend(mark.getPosition()));
    map.setBounds(newBounds);

    this.setState({
      markers,
    });

    this.setCenterMarker(categoryCode[0].code);
  }

  addCategoryMarker = (data) => {
    const {
      map, categorymarkers, markers, searchSize,
    } = this.state;
    categorymarkers.forEach(v => v.setMap(null));
    const bounds = new window.kakao.maps.LatLngBounds();
    markers.forEach(v => bounds.extend(v.getPosition()));
    console.log(data)
    const overlayArr = data.filter((v, i) => i < searchSize)
      .map((v) => {
        // 커스텀 오버레이가 표시될 위치입니다
        const content = `<a href=${v.place_url} style="text-decoration:none" target="_blank"><div class ="label" style="color: #ff0000; background-color: white; padding: 5px; border: 1px solid #ff0000; border-radius: 30px;"><span class="left"></span><span class="center">${v.place_name}</span><span class="right"></span></div></a>`;
        const position = new window.kakao.maps.LatLng(v.y, v.x);

        bounds.extend(position);
        // 커스텀 오버레이를 생성합니다
        return new window.kakao.maps.CustomOverlay({
          position,
          content,
          map,
        });
      });
    map.setBounds(bounds);
    this.setState({
      categorymarkers: overlayArr,
      bounds,
    });
  }

  handleChangeCategory = (e, i) => {
    const { categoryCode } = this.state;
    this.setState({
      categoryIndex: i,
      findRoad: 0,
    });
    this.setCenterMarker(categoryCode[i].code);
  }

  handleSizeChange = (e) => {
    const { categoryCode, categoryIndex } = this.state;
    this.setState({
      searchSize: e.target.value,
    });
    this.setCenterMarker(categoryCode[categoryIndex].code);
  }

  setCenterMarker = (code) => {
    const { markers } = this.state;

    const callback = (data, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        this.addCategoryMarker(data);
        return data;
      }
      return null;
    };

    if (markers.length > 0) {
      const centerData = getCenter(markers, basicCenterAlorithm);
      const centerLat = centerData.lat;
      const centerLon = centerData.lon;
      const center = new window.kakao.maps.LatLng(centerLat, centerLon);
      const places = new window.kakao.maps.services.Places();

      places.categorySearch(code, callback, {
        location: center,
        radius: 5000,
      });
    }
  }

  handleFindRoadChange = (e) => {
    this.setState({
      findRoad: e.target.value,
    });
  }

  handlefindRoad = () => {
    const { categorymarkers, findRoad } = this.state;
    const destination = categorymarkers[findRoad];
    const name = destination.getContent().replace(/(<([^>]+)>)/ig, '');
    const y = destination.getPosition().getLat();
    const x = destination.getPosition().getLng();
    window.open(`https://map.kakao.com/link/to/${name},${y},${x}`);
  }

  returnMain = () => {
    const { history } = this.props;
    const { location: { search } } = this.props;
    history.push(`/${search}`);
  }

  render() {
    const { classes } = this.props;
    const {
      categoryIndex, categoryCode, searchSize, categorymarkers, findRoad
    } = this.state;
    return (
      <Typography component="div" className={classes.root}>
        <Container className={classes.root} p={0}>
          <Box width={1} height={1}>
            <AppBar position="static" color="default" dense>
              <Tabs
                value={categoryIndex}
                onChange={this.handleChangeCategory}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="on"
                aria-label="scrollable auto tabs example"
              >
                {
                  categoryCode.map((v, i) => (<Tab label={v.value} key={`index${i.toString()}`} />))
                }
              </Tabs>
              <Grid container spacing={2} className={classes.slider}>
                <Grid item xs={4}>
                  <Select
                    native
                    value={searchSize}
                    onChange={this.handleSizeChange}
                    displayEmpty
                  >
                    {
                      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (<option value={v} key={`${v}select`}>주변 {v}개</option>))
                    }
                  </Select>
                </Grid>
                <Grid item xs={5}>
                  <Select
                    native
                    value={findRoad}
                    onChange={this.handleFindRoadChange}
                    displayEmpty
                  >
                    {
                      categorymarkers.map((v, i) => (<option value={i} key={`${i.toString()}select`}>{v.getContent().replace(/(<([^>]+)>)/ig, '')}</option>))
                    }
                  </Select>
                </Grid>
                <Grid item xs={3}>
                  <Button className={classes.button} variant="contained" color="primary" onClick={this.handlefindRoad}>길찾기</Button>
                </Grid>
              </Grid>
            </AppBar>
            <Box id="map" width={1} height={1} />
          </Box>
          <Chip label="다시하기!" color="primary" className={classes.returnButton} onClick={this.returnMain} />
        </Container>
      </Typography>
    );
  }
}

export default withStyles(styles)(MapPage);
