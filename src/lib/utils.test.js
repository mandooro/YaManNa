const { basicCenterAlorithm } = require('./utils');

class Marker {
  constructor(lat, lon) {
    this.lat = lat;
    this.lon = lon;
  }

  getPosition() {
    return {
      getLat: () => this.lat,
      getLng: () => this.lon,
    };
  }
}

describe('basicCenterAlorithm', () => {
  it('basic center algo', () => {
    const marker1 = new Marker(1, 5);
    const marker2 = new Marker(2, 10);
    const array = [marker1, marker2];
    expect(basicCenterAlorithm(array)).toEqual({
      lat: 1.5,
      lon: 7.5,
    });
  });
});
