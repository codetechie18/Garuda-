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
  const opts = Object.assign({ radius: 35, blur: 25, maxZoom: 17, max: maxCount }, options);

    const heatLayer = L.heatLayer(points, opts).addTo(map);
    try {
      if (points.length) map.fitBounds(points.map(p => [p[0], p[1]]), { padding: [40, 40] });
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

const Map = () => {
  // map incidents severity to intensity (0-1) and use central dataset
  const severityToIntensity = (s) => (s === 'high' ? 1.0 : s === 'medium' ? 0.6 : 0.3);
  const heatPoints = (heatDummy || []).map(i => [i.lat, i.lng, severityToIntensity(i.severity)]);

  // center on first dummy point if available, fallback to Mumbai
  const defaultCenter = heatDummy && heatDummy.length ? [heatDummy[0].lat, heatDummy[0].lng] : [19.0760, 72.8777];

  return (
    <div style={{ height: 360 }}>
  <MapContainer center={defaultCenter} zoom={11} style={{ height: '100%', width: '100%' }} preferCanvas={true}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatLayer points={heatPoints} options={{ radius: 35, blur: 25, maxZoom: 17 }} />
      </MapContainer>
    </div>
  );
};

export default Map;
