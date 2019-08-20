import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import clsx from 'clsx';
import {
  List, ListItem, ListItemText,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DirectionsIcon from '@material-ui/icons/Directions';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    flexGrow: 1,
    color: 'white',
    width: '100%',
    height: '100%',
    padding: theme.spacing(0),
    display: 'flex',
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
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
});

// TODO 해인아 요기 수정하면대
class SearchBar extends React.Component {
  state = {
    addr: '',
    searchDialog: false,
    results: [],
    name: '',
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    addList: PropTypes.func.isRequired,
    memberLen: PropTypes.number.isRequired,
    /* match: PropTypes.object.isRequired, */
  }

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  }

  handleSearchResult = (v, e) => {
    const { addList, memberLen } = this.props;
    let { name } = this.state;
    if (name.length === 0) name = `참석자${memberLen}`;
    addList({
      name,
      x: v.x,
      y: v.y,
      place_name: v.place_name ? v.place_name : v.address_name,
    });
    this.setState({
      searchDialog: false,
      addr: '',
      results: [],
      name: '',
    });
  }

  handleChange = (e) => {
    this.setState({
      addr: e.target.value,
    });
  }

  handleMyPClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude; // 위도
          const lon = position.coords.longitude; // 경도
          const { addList, memberLen } = this.props;
          let { name } = this.state;
          if (name.length === 0) name = `참석자${memberLen}`;
          addList({
            name,
            x: lon,
            y: lat,
            place_name: '내 위치',
          });
          this.setState({ searchDialog: false });
        },
      );
    } else {
      alert('위치 검색을 허용하지 않았거나 위치 검색을 지원하지 않는 브라우저입니다');
    }
  }

  handleBtnClick = () => {
    // 검색 input
    const { addr } = this.state;
    const input = addr;

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
            datas = result.filter((v, i) => i < 5);

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

  openSearchDialog = () => {
    this.setState({ searchDialog: true });
  }

  handleClose = () => {
    this.setState({ searchDialog: false });
  };

  render() {
    const { results, addr, searchDialog } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Grid item xs={12}>
          <IconButton
            id="searchBtn"
            onClick={this.openSearchDialog}
            className={classes.iconButton}
            aria-label="Search"
          >
            <AddIcon />
          </IconButton>
        </Grid>
        <Dialog
          id="dialog"
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={searchDialog}
        >
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="flex-end"
          >
            <TextField
              id="outlined-dense"
              label="참석자 이름"
              className={clsx(classes.textField, classes.dense)}
              onChange={this.handleNameChange}
              margin="dense"
              variant="outlined"
            />
            <Grid item xs={12} className={classes.root}>
              <InputBase
                id="standard-search"
                value={addr}
                onChange={this.handleChange}
                className={classes.input}
                placeholder="장소를 검색하세요!"
                inputProps={{ 'aria-label': '장소를 검색하세요!' }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.handleBtnClick();
                  }
                }}
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
                id="myP"
                color="primary"
                className={classes.iconButton}
                aria-label="Directions"
                onClick={this.handleMyPClick}
              >
                <DirectionsIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <List>
              {results.map((value, i) => (
                <ListItem
                  button
                  onClick={e => this.handleSearchResult(value, e)}
                  key={i.toString()}
                >
                  <ListItemText
                    primary={value.place_name ? value.place_name : value.address_name}
                    secondary={(
                      <Typography
                        variant="body2"
                      >
                        {value.place_name && value.address_name}
                      </Typography>
                    )}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(SearchBar);
