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
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { csv } from 'd3-request';
import { getCenter, basicCenterAlorithm } from './lib/utils';
import stationScore from './data/StationScore.csv';

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
    backgroundColor: theme.status.kakao,
    color: 'black',
  },
  bottomBar: {
    position: 'fixed',
    bottom: '0px',
    right: '0',
    zIndex: '10',
  },
  topBar: {
    position: 'fixed',
    top: '60px',
    right: '0',
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
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  returnButton: {
    position: 'fixed',
    left: '20px',
    top: '60px',
    zIndex: '11',
  },
  kakaoButton: {
    borderRadius: 0,
    backgroundColor: theme.status.kakao,
    color: 'black',
  },
  findRoadButton: {
    borderRadius: 0,
  },
  topButton: {

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
    menuToggle: false,
    countToggle: false,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  anchor = null

  anchor2 = null

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
    const categoryIndex = parsedQuery.category * 1;
    const searchCount = parsedQuery.count * 1;
    const select = parsedQuery.select * 1;
    this.setState({
      categoryIndex,
      searchSize: searchCount,
      findRoad: select,
    });

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
    const { map, categoryCode, categoryIndex } = this.state;

    const markers = pointArr.map((v) => {
      const lat = v.y;
      const lon = v.x;
      const content = `<div class ="label" style="color: #484d8b; background-color: white; padding: 2px; border: 1px solid #484d8b; border-radius: 30px; font-size: 12px; line-height: 12px"><span class="left"></span><span class="center">${v.name}</span><span class="right"></span></div>`;
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

    this.setCenterMarker(categoryCode[categoryIndex].code);
  }

  calRecommendScore = () => new Promise((resolve) => {
    csv(stationScore, (err, dt) => resolve(dt));
  })

  addCategoryMarker = async (data) => {
    const {
      map, categorymarkers, markers, searchSize, categoryIndex,
    } = this.state;
    categorymarkers.forEach(v => v.setMap(null));
    const bounds = new window.kakao.maps.LatLngBounds();
    markers.forEach(v => bounds.extend(v.getPosition()));
    let calData = data;
    if (categoryIndex === 0) {
      const dt = await this.calRecommendScore();
      const filteredData = data.filter((v, i) => i < 10);
      filteredData.sort((a, b) => {
        const aName = a.place_name.split('역 ')[0];
        const bName = b.place_name.split('역 ')[0];
        const aFind = dt.find(v => v['역명'] === aName);
        const bFind = dt.find(v => v['역명'] === bName);
        let aScore;
        if (!aFind) aScore = -1;
        else aScore = aFind['가중치'];
        let bScore;
        if (!bFind) bScore = -1;
        else bScore = bFind['가중치'];
        return bScore - aScore;
      });
      calData = filteredData;
    }
    const overlayArr = calData.filter((v, i) => i < searchSize)
      .map((v) => {
        // 커스텀 오버레이가 표시될 위치입니다
        const content = `<a href=${v.place_url} style="text-decoration:none" target="_blank"><div class ="label" style="color: #ff0000; background-color: white; padding: 2px; border: 1px solid #ff0000; border-radius: 30px; font-size: 12px; line-height: 12px"><span class="left"></span><span class="center">${v.place_name}</span><span class="right"></span></div></a>`;
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
    const { location: { search }, history } = this.props;
    const parsedQuery = queryString.parse(search);
    parsedQuery.category = i;
    const qs = queryString.stringify(parsedQuery);
    history.push({
      search: qs,
      select: 0,
    });
    this.setState({
      categoryIndex: i,
      findRoad: 0,
    });
    this.setCenterMarker(categoryCode[i].code);
  }

  handleSizeChange = (e, i) => {
    const { categoryCode, categoryIndex } = this.state;
    const { location: { search }, history } = this.props;
    const parsedQuery = queryString.parse(search);
    parsedQuery.count = i + 1;
    const qs = queryString.stringify(parsedQuery);
    history.push({
      search: qs,
    });
    this.setState({
      searchSize: i + 1,
    });
    this.setCenterMarker(categoryCode[categoryIndex].code);
    this.handleCountToggleClose();
  }

  handleFindRoadChange = (e) => {
    const { location: { search }, history } = this.props;
    const parsedQuery = queryString.parse(search);
    parsedQuery.select = e.target.value;
    const qs = queryString.stringify(parsedQuery);
    history.push({
      search: qs,
    });
    this.setState({
      findRoad: e.target.value,
    });
  }

  handleKakaoMessageChange = (e, i) => {
    const { location: { search }, history } = this.props;
    const parsedQuery = queryString.parse(search);
    parsedQuery.select = i;
    const qs = queryString.stringify(parsedQuery);
    history.push({
      search: qs,
    });
    this.setState({
      findRoad: i,
    });
    this.handleClose();
  }

  setCenterMarker = (code) => {
    const { markers } = this.state;

    const callback = (data, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        this.addCategoryMarker(data);
        return data;
      }
      const { categoryIndex } = this.state;
      if (categoryIndex === 7) alert('이 주변엔 아무 시설도 보이지 않습니다');
      else this.handleChangeCategory(null, (categoryIndex + 1) % 8);
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

  shareThisPage = () => {
    const { location: { search } } = this.props;
    const parsedQuery = queryString.parse(search);
    const people = parsedQuery.name.split(',');
    const { categorymarkers, findRoad } = this.state;
    const destination = categorymarkers[findRoad];
    const name = destination.getContent().replace(/(<([^>]+)>)/ig, '');
    window.Kakao.Link.sendDefault({
      objectType: 'text',
      text: `${people}님들의 약속 장소로 \n ${name}을 추천드려요! \n 야만나에서 중간 위치와 길찾기를 해보세요 >_<`,
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href,
      },
      buttons: [
        {
          title: '자세히보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  }

  handleToggle = () => {
    const { menuToggle } = this.state;
    this.setState({
      menuToggle: !menuToggle,
    });
  }

  handleClose = () => {
    this.setState({
      menuToggle: false,
    });
  }

  handleCountToggle = () => {
    const { countToggle } = this.state;
    this.setState({
      countToggle: !countToggle,
    });
  }

  handleCountToggleClose = () => {
    this.setState({
      countToggle: false,
    });
  }


  render() {
    const { classes } = this.props;
    const {
      categoryIndex, categoryCode, searchSize, categorymarkers, findRoad, menuToggle, countToggle,
    } = this.state;
    return (
      <Typography component="div" className={classes.root}>
        <Container className={classes.root} p={0}>
          <Box width={1} height={1}>
            <AppBar position="static" color="default">
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
            </AppBar>
            <Box id="map" width={1} height={1} />
          </Box>
          <Chip label="다시하기!" color="primary" className={classes.returnButton} onClick={this.returnMain} />
          {/* <Chip label="카톡 공유" className={classes.icon} onClick={this.shareThisPage} /> */}
          <Grid
            container
            className={classes.topBar}
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Grid item xs={6} align="right">
              <ButtonGroup
                variant="contained"
                color="primary"
                ref={(ref) => {
                  this.anchor2 = ref;
                }}
                aria-label="split button"
              >
                <Button
                  className={classes.topButton}
                  onClick={this.handleCountToggle}
                >
                  주변 {searchSize} 개
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper open={countToggle} anchorEl={this.anchor2} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper id="menu-list-grow">
                      <ClickAwayListener onClickAway={this.handleClose}>
                        <MenuList>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => (
                            <MenuItem
                              key={i.toString()}
                              selected={i === searchSize - 1}
                              onClick={event => this.handleSizeChange(event, i)}
                            >
                              {v}개
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Grid>
          </Grid>
          <Grid
            container
            className={classes.bottomBar}
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Grid item xs={12} align="right">
              <ButtonGroup
                variant="contained"
                color="secondary"
                ref={(ref) => {
                  this.anchor = ref;
                }}
                aria-label="split button"
              >
                <Button className={classes.button} onClick={this.handleToggle}>{categorymarkers[findRoad] && categorymarkers[findRoad].getContent().replace(/(<([^>]+)>)/ig, '')} <ArrowDropDownIcon /></Button>
                <Button
                  className={classes.findRoadButton}
                  color="primary"
                  size="small"
                  variant="contained"
                  onClick={this.handlefindRoad}
                >
                  길찾기
                </Button>
                <Button
                  className={classes.kakaoButton}
                  color="primary"
                  size="small"
                  variant="contained"
                  onClick={this.shareThisPage}
                >
                  카톡 공유
                </Button>
              </ButtonGroup>
              <Popper open={menuToggle} anchorEl={this.anchor} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper id="menu-list-grow">
                      <ClickAwayListener onClickAway={this.handleClose}>
                        <MenuList>
                          {categorymarkers.map((v, i) => (
                            <MenuItem
                              key={i.toString()}
                              selected={i === findRoad}
                              onClick={event => this.handleKakaoMessageChange(event, i)}
                            >
                              {v.getContent().replace(/(<([^>]+)>)/ig, '')}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Grid>
          </Grid>
        </Container>
      </Typography>
    );
  }
}

export default withStyles(styles)(MapPage);
