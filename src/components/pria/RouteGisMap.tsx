"use client";

import * as React from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

type LatLng = [number, number];

type DrawnPath = {
  positions: LatLng[];
  seasonal: boolean;
  active: boolean;
};

type MapPlace = { name: string; lat: number; lon: number };

const TILES = {
  topo: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles © Esri — sources: Esri, HERE, Garmin, USGS, EPA, NPS, NRCAN, GeoBase, OpenStreetMap contributors, and the GIS User Community",
  },
  imagery: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri — source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  },
} as const;

function leafletOf(loaded: typeof Leaflet & { default?: typeof Leaflet }) {
  const candidate = loaded.default ?? loaded;
  if (typeof candidate.map === "function") return candidate;
  const nested = (candidate as { default?: typeof Leaflet }).default;
  return nested && typeof nested.map === "function" ? nested : candidate;
}

export function RouteGisMap({
  network,
  paths,
  origin,
  destination,
  stops,
  basemap,
}: {
  network: LatLng[][];
  paths: DrawnPath[];
  origin: MapPlace | null;
  destination: MapPlace | null;
  stops: MapPlace[];
  basemap: keyof typeof TILES;
}) {
  const host = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<Leaflet.Map | null>(null);
  const layersRef = React.useRef<Leaflet.LayerGroup | null>(null);
  const tilesRef = React.useRef<Leaflet.TileLayer | null>(null);
  const [ready, setReady] = React.useState(false);
  const basemapRef = React.useRef(basemap);
  basemapRef.current = basemap;

  React.useEffect(() => {
    let dead = false;
    (async () => {
      const L = leafletOf(await import("leaflet"));
      if (dead || !host.current || mapRef.current) return;
      const map = L.map(host.current, { zoomControl: true, scrollWheelZoom: true });
      map.zoomControl.setPosition("topright");
      const spec = TILES[basemapRef.current];
      const tiles = L.tileLayer(spec.url, { attribution: spec.attribution, maxZoom: 16 });
      tiles.addTo(map);
      const layers = L.layerGroup().addTo(map);
      map.setView([35.15, 73.6], 6);
      mapRef.current = map;
      tilesRef.current = tiles;
      layersRef.current = layers;
      window.setTimeout(() => map.invalidateSize(), 80);
      setReady(true);
    })();
    return () => {
      dead = true;
      mapRef.current?.remove();
      mapRef.current = null;
      tilesRef.current = null;
      layersRef.current = null;
      setReady(false);
    };
  }, []);

  React.useEffect(() => {
    const tiles = tilesRef.current;
    if (!tiles) return;
    const spec = TILES[basemap];
    tiles.setUrl(spec.url);
    tiles.options.attribution = spec.attribution;
  }, [basemap, ready]);

  const drawKey = JSON.stringify({ paths, origin, destination, stops });

  React.useEffect(() => {
    if (!ready) return;
    let dead = false;
    (async () => {
      const L = leafletOf(await import("leaflet"));
      const map = mapRef.current;
      const group = layersRef.current;
      if (dead || !map || !group) return;
      group.clearLayers();
      for (const line of network) {
        if (line.length < 2) continue;
        L.polyline(line, { color: "#475569", weight: 2, opacity: 0.28 }).addTo(group);
      }
      const ordered = [...paths].sort((a, b) => Number(a.active) - Number(b.active));
      for (const path of ordered) {
        if (path.positions.length < 2) continue;
        const color = path.seasonal ? "#b45309" : "#0f766e";
        L.polyline(path.positions, {
          color: "#ffffff",
          weight: path.active ? 10 : 7,
          opacity: path.active ? 0.95 : 0.65,
        }).addTo(group);
        L.polyline(path.positions, {
          color,
          weight: path.active ? 5 : 3,
          opacity: path.active ? 1 : 0.8,
          dashArray: path.seasonal ? "2 10" : undefined,
        }).addTo(group);
      }
      for (const stop of stops) {
        L.circleMarker([stop.lat, stop.lon], {
          radius: 4,
          color: "#ffffff",
          weight: 1.5,
          fillColor: "#115e59",
          fillOpacity: 1,
        })
          .bindTooltip(stop.name, { direction: "top", opacity: 0.95 })
          .addTo(group);
      }
      if (origin) {
        L.circleMarker([origin.lat, origin.lon], {
          radius: 8,
          color: "#ffffff",
          weight: 2,
          fillColor: "#1d4ed8",
          fillOpacity: 1,
        })
          .bindTooltip(origin.name, { permanent: true, direction: "right", className: "route-tip", offset: [8, 0] })
          .addTo(group);
      }
      if (destination && (!origin || destination.name !== origin.name)) {
        L.circleMarker([destination.lat, destination.lon], {
          radius: 9,
          color: "#ffffff",
          weight: 2,
          fillColor: "#0f766e",
          fillOpacity: 1,
        })
          .bindTooltip(destination.name, { permanent: true, direction: "right", className: "route-tip", offset: [8, 0] })
          .addTo(group);
      }
      const bounds = L.latLngBounds([]);
      for (const path of paths) {
        for (const position of path.positions) bounds.extend(position);
      }
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.15), { padding: [28, 28], maxZoom: 9 });
    })();
    return () => {
      dead = true;
    };
  }, [ready, drawKey, network]);

  return (
    <div className="relative h-[520px] w-full">
      <style>{`
        .route-tip {
          background: #fff;
          border: 0;
          border-radius: 999px;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.22);
          color: #0f172a;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
        }
        .route-tip::before { display: none; }
      `}</style>
      <div ref={host} className="h-full w-full" />
    </div>
  );
}
