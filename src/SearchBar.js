import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import {
  Button, AppBar, Toolbar, List, ListItem, ListItemText,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

// TODO 해인아 요기 수정하면대
class SearchBar extends React.Component {
    state = {
      addr: '',
      searchDialog: false,
      results: [],
    }

    handleSearchResult = (v, e) => {
      console.log('hihi');
      console.log(v);
      console.log(this.props)
      this.props.addMyMarker(v.y, v.x);
      this.setState({ searchDialog: false });
    }

    handleChange = (e) => {
      this.setState({
        addr: e.target.value,
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
          datas = datas.concat(result);
          console.log(datas);

          // state의 빈 results 객체에 결과를 concat
          this.setState({
            results: this.state.results.concat(datas),
          });
          // console.log(this.state.results);

          // this.forceUpdate();
          this.setState({ searchDialog: true });
          // console.log(this.state.results[0].address_name);
          const el = document.getElementById('p');
          let str = '';
          if (el.innerHTML === 'hi') {
            for (let i = 0; i < this.state.results.length; i++) str += `${this.state.results[i].address_name} / `;
            el.innerHTML = str;
            // document.getElementById('test').setAttribute('primary', 'please');
          } else {
            el.innerHTML = '두 번은 안돼';
          }
        } else if (input != null) { // 키워드(장소명)로 검색한 경우
          ps.keywordSearch(input, (result, status, pagination) => {
            if (status === window.daum.maps.services.Status.OK) {
              // 검색 결과로 나온 장소 객체들을 붙임
              datas = datas.concat(result);
              console.log(datas);

              // state의 빈 results 객체에 결과를 concat
              this.setState({
                results: datas,
                searchDialog: true,
              });

              // console.log(this.state.results[0].y);

              const el = document.getElementById('p');
              let str = '';
              for (let i = 0; i < this.state.results.length; i++) str += `${this.state.results[i].place_name} / `;
              el.innerHTML = str;
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
      return (
        <div>
          <p id="p">hi</p>
          <TextField
            id="standard-search"
            label="장소를 검색하세요!"
            type="search"
            margin="normal"
            value={addr}
            onChange={this.handleChange}
          />

          <Button
            style={{ backgroundColor: 'yellow' }}
            id="searchBtn"
            onClick={this.handleBtnClick}
          >
검색
          </Button>

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
                <IconButton edge="end" color="inherit" onClick={this.handleClose} aria-label="Close">
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <List>
              {results.map(value => (
                <ListItem button onClick={e => this.handleSearchResult(value, e)} key={value.id}>
                  <ListItemText
                    primary={value.place_name}
                    secondary={value.address_name}
                  />
                </ListItem>
              ))}
            </List>
          </Dialog>
        </div>
      );
    }
}

export default SearchBar;
