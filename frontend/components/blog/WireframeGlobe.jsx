import { useMemo } from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from "react-native-svg";

// A faint, non-interactive vector globe used as hero-background decoration.
// Built from a real tilted-sphere projection so the meridian/parallel grid is
// geometrically clean. Front-facing arcs are drawn brighter than back-facing
// ones to give depth; a soft radial glow and a few nodes sit on the surface.
const TILT = (18 * Math.PI) / 180;
const PARALLELS = [-60, -30, 0, 30, 60];
const MERIDIANS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
// Longitudes centered near the front-facing band (~90°) so nodes spread evenly
// across the visible face instead of clustering at the silhouette edge.
const NODES = [
  { lat: 38, lon: 58 },
  { lat: 12, lon: 92, hub: true },
  { lat: -20, lon: 68 },
  { lat: 50, lon: 118 },
  { lat: -38, lon: 108 },
  { lat: 22, lon: 138 },
  { lat: -6, lon: 38, hub: true },
];
const CONNECTORS = [
  [0, 1],
  [3, 5],
  [2, 6],
];

const C_BACK = "rgba(42,111,151, 0.08)";
const C_FRONT = "rgba(42,111,151, 0.22)";
const C_LIMB = "rgba(14,34,53, 0.13)";
const C_LINK = "rgba(42,111,151, 0.18)";
const C_NODE = "#86CFE0";
const C_HUB = "#2A6F97";

function build(size) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.42;
  const cosA = Math.cos(TILT);
  const sinA = Math.sin(TILT);

  const project = (latDeg, lonDeg) => {
    const la = (latDeg * Math.PI) / 180;
    const lo = (lonDeg * Math.PI) / 180;
    const X = R * Math.cos(la) * Math.cos(lo);
    const Y = R * Math.sin(la);
    const Z = R * Math.cos(la) * Math.sin(lo);
    return {
      x: cx + X,
      y: cy - (Y * cosA - Z * sinA),
      z: Y * sinA + Z * cosA, // > 0 means facing the viewer (front)
    };
  };

  // Turn a sampled curve into front/back path strings, breaking the subpath
  // whenever it crosses the silhouette so back arcs never chord the sphere.
  const toPaths = (pts) => {
    let front = "";
    let back = "";
    let fOpen = false;
    let bOpen = false;
    pts.forEach((p) => {
      const xy = `${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
      if (p.z >= 0) {
        front += (fOpen ? "L" : "M") + xy;
        fOpen = true;
        bOpen = false;
      } else {
        back += (bOpen ? "L" : "M") + xy;
        bOpen = true;
        fOpen = false;
      }
    });
    return { front, back };
  };

  const front = [];
  const back = [];

  PARALLELS.forEach((lat) => {
    const pts = [];
    for (let lon = 0; lon <= 360; lon += 5) pts.push(project(lat, lon));
    const { front: f, back: b } = toPaths(pts);
    if (f.trim()) front.push(f);
    if (b.trim()) back.push(b);
  });

  MERIDIANS.forEach((lon) => {
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 5) pts.push(project(lat, lon));
    const { front: f, back: b } = toPaths(pts);
    if (f.trim()) front.push(f);
    if (b.trim()) back.push(b);
  });

  const projected = NODES.map((n) => ({ ...n, ...project(n.lat, n.lon) }));
  const nodes = projected.filter((n) => n.z >= 0);
  const links = CONNECTORS.filter(
    ([a, b]) => projected[a].z >= 0 && projected[b].z >= 0
  ).map(([a, b]) => ({ a: projected[a], b: projected[b] }));

  return { cx, cy, R, front, back, nodes, links };
}

function WireframeGlobe({ size = 560, style }) {
  const g = useMemo(() => build(size), [size]);

  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <Svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        <Defs>
          <RadialGradient cx="50%" cy="50%" id="globeGlow" r="50%">
            <Stop offset="0%" stopColor="#2A6F97" stopOpacity="0.1" />
            <Stop offset="55%" stopColor="#86CFE0" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#2A6F97" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Circle cx={g.cx} cy={g.cy} fill="url(#globeGlow)" r={g.R * 1.08} />

        {g.back.map((d, i) => (
          <Path d={d} fill="none" key={`b${i}`} stroke={C_BACK} strokeWidth={1} />
        ))}
        {g.front.map((d, i) => (
          <Path d={d} fill="none" key={`f${i}`} stroke={C_FRONT} strokeWidth={1} />
        ))}

        <Circle cx={g.cx} cy={g.cy} fill="none" r={g.R} stroke={C_LIMB} strokeWidth={1.3} />

        {g.links.map((l, i) => (
          <Path
            d={`M${l.a.x.toFixed(1)} ${l.a.y.toFixed(1)} L${l.b.x.toFixed(1)} ${l.b.y.toFixed(1)}`}
            fill="none"
            key={`l${i}`}
            stroke={C_LINK}
            strokeWidth={1}
          />
        ))}

        {g.nodes.map((n, i) => (
          <Circle
            cx={n.x}
            cy={n.y}
            fill={n.hub ? C_HUB : C_NODE}
            fillOpacity={0.14}
            key={`ng${i}`}
            r={n.hub ? 13 : 9}
          />
        ))}
        {g.nodes.map((n, i) => (
          <Circle
            cx={n.x}
            cy={n.y}
            fill={n.hub ? C_HUB : C_NODE}
            key={`n${i}`}
            r={n.hub ? 4.5 : 3}
          />
        ))}
      </Svg>
    </View>
  );
}

export default WireframeGlobe;
