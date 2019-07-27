
export const getCenter = (makers, algorithm) => algorithm(makers);
export const basicCenterAlorithm = (markers) => {
  const count = markers.length;
  const centerLat = markers.reduce(((p, c) => p + c.getPosition().getLat()), 0) / count;
  const centerLon = markers.reduce(((p, c) => p + c.getPosition().getLng()), 0) / count;
  return {
    lat: centerLat,
    lon: centerLon,
  };
};

export default {
  getCenter,
  basicCenterAlorithm,
};
