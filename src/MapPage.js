import React from 'react';
import { fire,getFireDB } from './shared/firebase'
import './Map.css'
import SearchBar from './SearchBar'

class MapPage extends React.Component {

    constructor() {
        super();
        fire();
    }

    componentDidMount() {

        // 지도에 마커와 인포윈도우를 표시하는 함수입니다
        const displayMarker = (locPosition, message) => {

            // 마커를 생성합니다
            let marker = new window.daum.maps.Marker({
                map: map,
                position: locPosition
            });

            let iwContent = message, // 인포윈도우에 표시할 내용
                iwRemoveable = true;

            // 인포윈도우를 생성합니다
            let infowindow = new window.daum.maps.InfoWindow({
                content : iwContent,
                removable : iwRemoveable
            });

            // 인포윈도우를 마커위에 표시합니다
            infowindow.open(map, marker);

            // 지도 중심좌표를 접속위치로 변경합니다
            map.setCenter(locPosition);
        }

        let el = document.getElementById('map');
        let map = new window.daum.maps.Map(el, {
            center: new window.daum.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
            level: 4 //지도의 레벨(확대, 축소 정도)
        });


        let bounds = new window.daum.maps.LatLngBounds();

        const { match: { params } } = this.props;
        const history = this.props.history;

        if (navigator.geolocation) {
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    let lat = position.coords.latitude, // 위도
                        lon = position.coords.longitude; // 경도
                    console.log(window.localStorage)
                    if(params.id === undefined || window.localStorage.getItem(params.id) !== "true") {
                        if(params.id === undefined) {
                            getFireDB().ref().push({master:{lat:lat, lon:lon}})
                                .then(result => {
                                    console.log(history)
                                    const key = result.key
                                    window.localStorage.setItem(key,"true")
                                    history.push('/spot/'+key);
                                })
                                .catch(e => {
                                    console.log(e)
                                })
                        }else {
                            getFireDB().ref().child(params.id).push({lat:lat, lon:lon})
                            window.localStorage.setItem(params.id,"true")
                        }
                    }



                    if(params.id !== undefined) {

                        // 마커 이미지의 이미지 주소입니다
                        let imageSrc = "//t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

                        let marker
                        let garo = 0
                        let sero = 0
                        let count = 0

                        let starCountRef = getFireDB().ref(params.id);
                        // starCountRef.on('value', function(snapshot) {
                        //
                        //     snapshot.forEach(function(childSnapshot) {
                        //         let childKey = childSnapshot.key;
                        //         let childData = childSnapshot.val();
                        //         console.log(childKey)
                        //         console.log(childData)
                        //
                        //         garo += (childData.lat * 1)
                        //         sero += (childData.lon * 1)
                        //         count++
                        //
                        //         // 마커 이미지의 이미지 크기 입니다
                        //         let imageSize = new window.daum.maps.Size(24, 35);
                        //
                        //         // 마커 이미지를 생성합니다
                        //         let markerImage = new window.daum.maps.MarkerImage(imageSrc, imageSize);
                        //
                        //         // 마커를 생성합니다
                        //         let mk = new window.daum.maps.Marker({
                        //             map: map, // 마커를 표시할 지도
                        //             position: new window.daum.maps.LatLng(childData.lat, childData.lon), // 마커를 표시할 위치
                        //             title : childKey, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                        //         });
                        //
                        //         bounds.extend(mk)
                        //
                        //     });
                        //
                        //     // 마커 이미지의 이미지 크기 입니다
                        //     let imageSize2 = new window.daum.maps.Size(40, 50);
                        //
                        //     // 마커 이미지를 생성합니다
                        //     let markerImage2 = new window.daum.maps.MarkerImage(imageSrc, imageSize2);
                        //
                        //     let center = new window.daum.maps.LatLng(garo/count, sero/count)
                        //     // 마커를 생성합니다
                        //     marker = new window.daum.maps.Marker({
                        //         map: map, // 마커를 표시할 지도
                        //         position: center, // 마커를 표시할 위치
                        //         title : '여기가 중간', // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                        //         image : markerImage2 // 마커 이미지
                        //     });
                        //     map.setCenter(center);
                        // });

                        let infowindow

                        starCountRef.on('child_added', function(data) {
                            if(marker != null) marker.setMap(null)
                            if(infowindow != null) infowindow.close()

                            garo += (data.val().lat * 1)
                            sero += (data.val().lon * 1)
                            count++

                            // 마커 이미지의 이미지 크기 입니다
                            let imageSize = new window.daum.maps.Size(24, 35);

                            // 마커 이미지를 생성합니다
                            new window.daum.maps.MarkerImage(imageSrc, imageSize);

                            // 마커를 생성합니다
                            new window.daum.maps.Marker({
                                map: map, // 마커를 표시할 지도
                                position: new window.daum.maps.LatLng(data.val().lat, data.val().lon), // 마커를 표시할 위치
                                title : data.key, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                            });

                            bounds.extend(new window.daum.maps.LatLng(data.val().lat, data.val().lon))

                            // 센터 부분

                            // 마커 이미지의 이미지 크기 입니다
                            let imageSize2 = new window.daum.maps.Size(40, 50);

                            // 마커 이미지를 생성합니다
                            let markerImage2 = new window.daum.maps.MarkerImage(imageSrc, imageSize2);

                            let center = new window.daum.maps.LatLng(garo/count, sero/count)
                            // 마커를 생성합니다
                            marker = new window.daum.maps.Marker({
                                map: map, // 마커를 표시할 지도
                                position: center, // 마커를 표시할 위치
                                title : '여기가 중간', // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                                image : markerImage2 // 마커 이미지
                            });
                            map.setCenter(center);

                            let iwContent = "당신들의 중간은 여기입니다", // 인포윈도우에 표시할 내용
                                iwRemoveable = true;

                            // 인포윈도우를 생성합니다
                            infowindow = new window.daum.maps.InfoWindow({
                                content : iwContent,
                                removable : iwRemoveable
                            });

                            // 인포윈도우를 마커위에 표시합니다
                            infowindow.open(map, marker);

                            map.setBounds(bounds);

                        });
                    }

                    // let locPosition = new window.daum.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                    //     message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다
                    //
                    // // 마커와 인포윈도우를 표시합니다
                    // displayMarker(locPosition, message);
                },
                function error(err) {
                    console.warn('ERROR(' + err.code + '): ' + err.message);
                }
            );

        } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
            let locPosition = new window.daum.maps.LatLng(33.450701, 126.570667),
                message = 'geolocation을 사용할수 없어요..'
            displayMarker(locPosition, message);
        }

    }

    render() {
        return (
            <div className="App App-header">
                <SearchBar/>
                <div id="map" className="mapClass"/>
            </div>
        );
    }
}

export default MapPage;
