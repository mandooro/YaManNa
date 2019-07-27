import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import {
  Button, AppBar, Toolbar, List, ListItem, ListItemText,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import PropTypes from 'prop-types';

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
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
});

// TODO 해인아 요기 수정하면대
class SearchBar extends React.Component {
  state = {
    addr: '',
    searchDialog: false,
    results: [],
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    /* match: PropTypes.object.isRequired, */
  }

  handleSearchResult = (v, e) => {
    console.log('hihi');
    console.log(v);
    console.log(this.props);
    this.props.addMyMarker(v.y, v.x);
    this.setState({ searchDialog: false });
  }

  handleChange = (e) => {
    this.setState({
      addr: e.target.value,
    });
  }

  handleMyPClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도
        this.props.addMyMarker(lat, lon);
      });
  }

  handleBtnClick = () => {
    // 검색 input
    const input = this.state.addr;

    // state의 results를 담는 객체
    let datas = [];

    // 주소-좌표 변환 객체를 생성
    const geocoder = new window.daum.maps.services.Geocoder();

    // 키워드 검색 객체를 생성
    const ps = new window.daum.maps.services.Places();

    // 주소로 검색한 경우
    geocoder.addressSearch(input, (result, status, pagination) => {
      if (input != null && status === window.daum.maps.services.Status.OK) {
        // let coords = new window.daum.maps.LatLng(result[0].y, result[0].x);
        // alert("Lat: "+result[0].y+", \n"+
        //        "Lng: "+result[0].x);

        // alert(result[0].place_name+"\n" //장소명
        //    +result[0].road_address_name+"\n"   //도로명주소
        //    +result[0].address_name+"\n"    //지번주소
        //    +result[0].phone+"\n");  //전화번호 //있으면 출력 없으면 안 출력

        // 검색 결과로 나온 장소 객체들을 붙임
        datas = result;
        console.log(datas);

        // state의 빈 results 객체에 결과를 concat
        this.setState({
          results: datas,
        });
        // console.log(this.state.results);

        // this.forceUpdate();
        this.setState({ searchDialog: true });
        // console.log(this.state.results[0].address_name);
      } else if (input != null) { // 키워드(장소명)로 검색한 경우
        ps.keywordSearch(input, (result, status, pagination) => {
          if (status === window.daum.maps.services.Status.OK) {
            // 검색 결과로 나온 장소 객체들을 붙임
            datas = result;
            console.log(datas);

            // state의 빈 results 객체에 결과를 concat
            this.setState({
              results: datas,
              searchDialog: true,
            });

            // console.log(this.state.results[0].y);
          } else if (status === window.daum.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
          } else if (status === window.daum.maps.services.Status.ERROR) {
            alert('검색 결과 중 오류가 발생했습니다.');
          }
        });
      } else if (status === window.daum.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === window.daum.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
      }
    });
  }

  handleClose = () => {
    this.setState({ searchDialog: false });
  };

  render() {
    const { results, addr, searchDialog } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-end"
        >
          <IconButton className={classes.iconButton} aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <InputBase
            id="standard-search"
            value={addr}
            onChange={this.handleChange}
            className={classes.input}
            placeholder="장소를 검색하세요!"
            inputProps={{ 'aria-label': '장소를 검색하세요!' }}
          />
          <IconButton
            id="searchBtn"
            onClick={this.handleBtnClick}
            className={classes.iconButton}
            aria-label="Search"
          >
            <SearchIcon />
          </IconButton>
          <Divider className={classes.divider} />
          <IconButton
            id="myP" color="primary" className={classes.iconButton} aria-label="Directions"
            onClick={this.handleMyPClick}
          >
            <DirectionsIcon />
            <Typography variant="caption" display="block">
              내위치
            </Typography>
          </IconButton>

        </Grid>
        <Dialog
          id="dialog"
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={searchDialog}
        >
          <AppBar position="relative">
            <Toolbar>
              <Typography variant="h6" flex={1}>
                장소 검색
              </Typography>
              <IconButton edge="end" color="primary" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <List>
            {results.map(value => (
              <ListItem button onClick={e => this.handleSearchResult(value, e)} key={value.index}>
                <ListItemText
                  primary={value.place_name}
                  // secondary={value.address_name}{value.road_address_name}
                  secondary={(
                    <React.Fragment>
                      <Typography
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {value.address_name}
                      </Typography>
                      {/* {`\n${value.road_address_name}`} */}
                    </React.Fragment>
                  )}
                />
              </ListItem>
            ))}
          </List>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(SearchBar);
