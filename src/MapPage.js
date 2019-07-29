import React from 'react';
import './Map.css';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/styles';
import Icon from '@material-ui/core/Icon';
import HelpOutlinedIcon from '@material-ui/icons/HelpOutlined';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import { getFireDB } from './shared/firebase';
import { getCenter, basicCenterAlorithm } from './lib/utils';
import SearchBar from './SearchBar';
import Helper from './Helper';

const styles = theme => ({
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
});

class MapPage extends React.Component {
  state = {
    // 마커를 배열에 넣고 사용할 예정
    markers: [],
    myMarker: null, // 내 마커의 키
    centerMarker: null,
    helper: false,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  async componentDidMount() {
    // 맵 초기화
    const el = document.getElementById('map');
    const map = await new window.kakao.maps.Map(el, {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표.
      level: 4, // 지도의 레벨(확대, 축소 정도)
    });
    const { match: { params } } = this.props;
    // 위치설정을 허용한 경우
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude; // 위도
          const lon = position.coords.longitude; // 경도
          const myMarkerPosition = new window.kakao.maps.LatLng(lat, lon);
          if (window.localStorage.getItem(params.id)) { // 이미 들어온 경우
            this.setState(
              {
                myMarker:
                  {
                    keyValue: window.localStorage.getItem(params.id),
                    position: myMarkerPosition,
                  },
              },
            ); // 내 마커위치 기억
          } else { // 처음 들어온 경우
            this.addMyMarker(lat, lon);
          }
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        },
      );
    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      // TODO 위치허용 안하면 어떡하지?
    }

    // 데이터 읽고, 마커 추가하는 부분
    const starCountRef = await getFireDB().ref(params.id);
    starCountRef.on('child_added', (data) => {
      this.addMarker(map, data.val().lat, data.val().lon, data.key);
    });

    // 데이터가 삭제됐을시, 읽고 마커 지우는 부분
    starCountRef.on('child_removed', (data) => {
      this.delMarker(map, data.key);
    });
  }

  addMyMarker = async (lat, lon) => {
    const myMarkerPosition = new window.kakao.maps.LatLng(lat, lon);
    const { match: { params } } = this.props;
    await this.delMyMarker();
    getFireDB().ref().child(params.id).push({ lat, lon })
      .then((result) => {
        const { key } = result;
        window.localStorage.setItem(params.id, key);
        this.setState(
          {
            myMarker:
              {
                keyValue: window.localStorage.getItem(params.id),
                position: myMarkerPosition,
              },
          },
        ); // 내 마커위치 기억
      })
      .catch((e) => {
        console.log(e);
      });
  }

  delMyMarker = () => {
    const { match: { params } } = this.props;
    const { id } = params;
    const { myMarker } = this.state;
    if (myMarker !== null) {
      const key = myMarker.keyValue;
      getFireDB().ref(id).child(key).remove();
    }
  }

  addMarker = async (map, lat, lon, key) => {
    // 각자 위치의 마커를 생성하는 부분
    // 마커를 생성합니다
    const jumPosition = new window.kakao.maps.LatLng(lat, lon);
    const jum = new window.kakao.maps.Marker({
      map, // 마커를 표시할 지도
      position: jumPosition, // 마커를 표시할 위치
      title: key, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
    });
    // 마커를 나중에 지울 수 있도록 기억함
    const { markers } = this.state;
    this.setState({
      markers: markers.concat(jum),
    });
    this.displayCenterMarker(map);
  }

  delMarker = async (map, key) => {
    const { markers } = this.state;
    await markers.forEach(v => v.setMap(null));
    const delMarkers = markers.filter(mark => mark.getTitle() !== key);
    this.setState({
      markers: delMarkers,
    });
    this.displayMarker(map);
    this.displayCenterMarker(map);
  };

  displayMarker = (map) => {
    // 마커를 생성합니다
    const { markers } = this.state;
    markers.forEach(v => v.setMap(map));
  };

  displayCenterMarker = (map) => {
    // 스테이트에서 변수 처리
    const { markers, centerMarker } = this.state;
    // 센터마크 초기화 부분
    if (centerMarker != null) centerMarker.setMap(null);
    if (markers.length > 0) {
      // 새로운 센터 위치 계산 로직
      const centerData = getCenter(markers, basicCenterAlorithm)
      const centerLat = centerData.lat
      const centerLon = centerData.lon
      // 마커 이미지의 이미지 크기와 이미지 입니다
      const imageSize = new window.kakao.maps.Size(40, 50);
      // TODO 마커 이미지 어떡하지? 엑스자 표시같은거 좋을듯 원피스 보물처럼
      const imageSrc = '//www.freepngimg.com/download/map/62663-vector-map-google-center-icons-maps-computer.png';
      // 마커 이미지를 생성합니다
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

      const center = new window.kakao.maps.LatLng(centerLat, centerLon);
      const marker = new window.kakao.maps.Marker({
        map, // 마커를 표시할 지도
        position: center, // 마커를 표시할 위치
        title: '여기가 중간', // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });
      // 마커를 생성합니다
      this.setState({ centerMarker: marker });
      map.setCenter(center);
      // 맵의 범위를 변경
      // 지도의 범위 객체
      const bounds = new window.kakao.maps.LatLngBounds();
      markers.forEach(mark => bounds.extend(mark.getPosition()));
      map.setBounds(bounds);
    }
  };

  sendLink = () => {
    const { match: { params } } = this.props;
    const { id } = params;
    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '중간 위치에서 만나세요',
        description: '중간 위치를 찾아주는 중간 위치 앱!',
        imageUrl: 'http://mblogthumb2.phinf.naver.net/MjAxODAxMDlfMTMx/MDAxNTE1NDkwNzAxNjQ5.TDRphYc2xTlO5JpsAZjYoXXQKZZvM-TciZN3F8CyBFMg.G2mOPygc54OQvtb3Y5fg_v3b_2AYX9ix4lvWAFY-sBsg.JPEG.jongmin963/Screenshot_20180109-160050.jpg?type=w800',
        link: {
          mobileWebUrl: `http://localhost:3000/spot/${id}`,
          webUrl: `http://localhost:3000/spot/${id}`,
        },
      },
    });
  };

  showHelper = () => {
    this.setState({
      helper: true,
    });
  }

  closeHelper = () => {
    this.setState({
      helper: false,
    });
  }

  render() {
    const { classes } = this.props;
    const { helper } = this.state;
    return (
      <Typography component="div" className={classes.root}>
        <Container className={classes.root} p={0}>
          <Box width={1} height={1}>
            <SearchBar addMyMarker={(lat, lon) => this.addMyMarker(lat, lon)} />
            <Box id="map" width={1} height={1} />
          </Box>
        </Container>
        <HelpOutlinedIcon className={classes.icon2} onClick={this.showHelper} color="primary">help</HelpOutlinedIcon>
        <Icon className={classes.icon} onClick={this.sendLink} color="primary" fontSize="large">share</Icon>
        <Dialog fullScreen open={helper} onClose={this.closeHelper}>
          <Toolbar>
            <IconButton edge="end" color="inherit" onClick={this.closeHelper} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Helper />
        </Dialog>
      </Typography>
    );
  }
}

export default withStyles(styles)(MapPage);
