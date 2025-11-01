import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropTypes from 'prop-types';
import 'leaflet.heat/dist/leaflet-heat.js';
import heatDummy from '../data/heatDummy';

/**
 * HeatLayer wraps leaflet.heat for react-leaflet.
 * @param {{points: Array<Array<number>>, options: object}} props
 */
const HeatLayer = ({ points, options = {} }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return undefined;

    const maxCount = Math.max(...points.map(p => p[2] || 1), 1);
    // Use default leaflet.heat gradient by not supplying a custom gradient
    // autoFit controls whether HeatLayer will call map.fitBounds on the points
    const opts = Object.assign({ radius: 35, blur: 25, maxZoom: 17, max: maxCount, autoFit: false }, options);

    const heatLayer = L.heatLayer(points, opts).addTo(map);
    try {
      if (points.length && opts.autoFit) map.fitBounds(points.map(p => [p[0], p[1]]), { padding: [40, 40] });
    } catch {
      /* ignore fitBounds errors */
    }

    return () => { if (heatLayer && map) map.removeLayer(heatLayer); };
    // create a shallow stable key for deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, points.length, options.radius, options.blur, options.maxZoom]);

  return null;
};

HeatLayer.propTypes = {
  points: PropTypes.arrayOf(PropTypes.array).isRequired,
  options: PropTypes.object,
};

const Map = ({ points: propPoints, center, zoom = 11, minZoom, maxBounds }) => {
  // map incidents severity to intensity (0-1) and use central dataset
  const severityToIntensity = (s) => (s === 'high' ? 1.0 : s === 'medium' ? 0.6 : 0.3);

  // normalize incoming points: accept either array of [lat,lng,intensity] or objects {lat,lng,count|severity}
  const pointsArray = (propPoints && propPoints.length)
    ? propPoints.map(p => Array.isArray(p) ? p : [p.lat, p.lng, p.count || 1])
    : (heatDummy || []).map(i => [i.lat, i.lng, severityToIntensity(i.severity)]);

  // determine center: prefer explicit center prop, then first point, then fallback (Mumbai)
  const defaultCenter = center || (pointsArray && pointsArray.length ? [pointsArray[0][0], pointsArray[0][1]] : [19.0760, 72.8777]);

  return (
    <div style={{ height: 360 }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        minZoom={minZoom}
        style={{ height: '100%', width: '100%' }}
        preferCanvas={true}
        maxBounds={maxBounds}
        maxBoundsViscosity={maxBounds ? 0.9 : 0}
      >
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatLayer points={pointsArray} options={{ radius: 35, blur: 25, maxZoom: 17 }} />
      </MapContainer>
    </div>
  );
};

Map.propTypes = {
  points: PropTypes.array,
  center: PropTypes.array,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxBounds: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default Map;
