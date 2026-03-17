// src/components/intero/InteroLandscapeScene.jsx

import React from "react";

function SceneFrame({ children }) {
  return <g>{children}</g>;
}

function Sky({ p, sunX = 262, sunY = 46, sunR = 9 }) {
  return (
    <>
      <rect x="0" y="0" width="320" height="320" rx="28" fill={p.skyBottom} />
      <path
        d="M0 0 H320 V154 C264 164 216 166 168 160 C120 154 70 152 0 164 Z"
        fill={p.skyTop}
      />
    </>
  );
}

function LayeredGround({ p }) {
  return (
    <>
      <path
        d="M0 206 C52 192 106 192 160 200 C214 208 268 210 320 204 L320 320 L0 320 Z"
        fill={p.far}
      />
      <path
        d="M0 226 C54 218 108 220 162 228 C218 236 270 238 320 232 L320 320 L0 320 Z"
        fill={p.mid}
      />
      <path
        d="M0 246 C72 242 140 244 208 248 C252 250 288 250 320 246 L320 320 L0 320 Z"
        fill={p.near}
      />
      <rect x="0" y="252" width="320" height="68" fill={p.ground} />
    </>
  );
}

function ForegroundShadow() {
  return <ellipse cx="160" cy="280" rx="54" ry="12" fill="rgba(0,0,0,0.18)" />;
}

function PineCluster({ p, positions = [56, 96, 132, 248], baseY = 246 }) {
  return (
    <g opacity="0.92">
      {positions.map((x) => (
        <g key={x}>
          <rect x={x} y={baseY - 28} width="5" height="28" fill={p.detail} rx="2" />
          <polygon
            points={`${x - 10},${baseY - 22} ${x + 2.5},${baseY - 48} ${x + 15},${baseY - 22}`}
            fill={p.detail}
          />
        </g>
      ))}
    </g>
  );
}

function MountainScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />
      <polygon
        points="0,182 66,120 128,164 192,108 258,160 320,132 320,320 0,320"
        fill={p.far}
      />
      <polygon
        points="0,198 78,146 150,188 226,140 320,186 320,320 0,320"
        fill={p.mid}
      />
      <LayeredGround p={p} />
      <path d="M184 112 L216 134 L196 134 Z" fill={p.accent} opacity="0.55" />
      <PineCluster p={p} positions={[244, 264, 284]} />
      <ForegroundShadow />
    </SceneFrame>
  );
}

function ForestScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />
      <path
        d="M0 190 C60 170 116 174 174 186 C236 198 286 196 320 188 L320 320 L0 320 Z"
        fill={p.far}
      />
      <path
        d="M0 212 C62 198 128 204 184 216 C236 228 282 226 320 220 L320 320 L0 320 Z"
        fill={p.mid}
      />
      <LayeredGround p={p} />
      <PineCluster p={p} positions={[34, 62, 92, 224, 256, 288]} />
      <ForegroundShadow />
    </SceneFrame>
  );
}

function WaterfallScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />
      <polygon
        points="0,192 92,150 158,190 228,138 320,186 320,320 0,320"
        fill={p.far}
      />
      <rect x="124" y="248" width="64" height="14" rx="7" fill={p.mid} opacity="0.85" />
      <LayeredGround p={p} />
      <ForegroundShadow />
    </SceneFrame>
  );
}

function DesertScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />
      <path
        d="M0 208 C48 186 94 188 138 206 C180 222 228 220 320 194 L320 320 L0 320 Z"
        fill={p.far}
      />
      <path
        d="M0 230 C60 212 112 216 156 228 C214 246 260 244 320 228 L320 320 L0 320 Z"
        fill={p.mid}
      />
      <LayeredGround p={p} />
      
      <ForegroundShadow />
    </SceneFrame>
  );
}


function ParkScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />
      <LayeredGround p={p} />
      <PineCluster p={p} positions={[52, 82, 250]} />
      <rect x="204" y="224" width="48" height="6" rx="3" fill={p.detail} opacity="0.8" />
      <rect x="210" y="215" width="36" height="6" rx="3" fill={p.detail} opacity="0.8" />
      <rect x="212" y="230" width="4" height="16" fill={p.detail} opacity="0.8" />
      <rect x="240" y="230" width="4" height="16" fill={p.detail} opacity="0.8" />
      <ForegroundShadow />
    </SceneFrame>
  );
}

function CliffScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />
      <path
        d="M0 194 C68 176 136 180 320 188 L320 320 L0 320 Z"
        fill={p.far}
      />
      <polygon
        points="0,230 108,222 108,140 136,140 136,230 320,230 320,320 0,320"
        fill={p.mid}
      />
      <rect x="0" y="248" width="320" height="72" fill={p.ground} />
      <ForegroundShadow />
    </SceneFrame>
  );
}

function CityScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />
      <g opacity="0.9">
        <rect x="18" y="170" width="22" height="56" fill={p.detail} />
        <rect x="48" y="150" width="30" height="76" fill={p.detail} />
        <rect x="90" y="162" width="24" height="64" fill={p.detail} />
        <rect x="124" y="142" width="36" height="84" fill={p.detail} />
        <rect x="172" y="156" width="26" height="70" fill={p.detail} />
        <rect x="208" y="134" width="34" height="92" fill={p.detail} />
        <rect x="254" y="160" width="28" height="66" fill={p.detail} />
      </g>
      <LayeredGround p={p} />
      <ForegroundShadow />
    </SceneFrame>
  );
}

function RiverScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />
      <path
        d="M0 188 C70 172 130 176 320 188 L320 320 L0 320 Z"
        fill={p.far}
      />
      <LayeredGround p={p} />
<g transform="translate(0 30)">
  <path
  d="M0 270 C80 260 160 280 240 268 C280 262 300 268 320 270"
  fill="none"
  stroke={p.accent}
  strokeWidth="26"
  strokeLinecap="round"
  opacity="0.8"
/>

<path
  d="M0 270 C80 260 160 280 240 268 C280 262 300 268 320 270"
  fill="none"
  stroke={p.mid}
  strokeWidth="10"
  strokeLinecap="round"
  opacity="0.4"
/>
</g>
      <ForegroundShadow />
    </SceneFrame>
  );
}

function CanyonScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />
      <path
        d="M0 200 C56 186 104 186 154 198 C210 212 264 210 320 196 L320 320 L0 320 Z"
        fill={p.far}
      />
      <path
        d="M0 228 C48 214 92 216 128 224 C188 238 246 236 320 222 L320 320 L0 320 Z"
        fill={p.mid}
      />
      <rect x="138" y="214" width="46" height="8" rx="4" fill={p.detail} opacity="0.7" />
      <LayeredGround p={p} />
      <ForegroundShadow />
    </SceneFrame>
  );
}

function LakeScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />
      <path
        d="M0 196 C64 178 128 182 320 194 L320 320 L0 320 Z"
        fill={p.far}
      />
      <rect x="0" y="214" width="320" height="40" fill={p.accent} opacity="0.52" />
      <path
        d="M0 242 C70 236 144 238 320 244 L320 320 L0 320 Z"
        fill={p.mid}
      />
      <rect x="0" y="252" width="320" height="68" fill={p.ground} />
      <ForegroundShadow />
    </SceneFrame>
  );
}

function NightHillScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} sunX={262} sunY={44} sunR={8} />
      <path
        d="M0 198 C68 178 126 184 186 196 C246 208 284 208 320 202 L320 320 L0 320 Z"
        fill={p.far}
      />
      <LayeredGround p={p} />
      <PineCluster p={p} positions={[240, 262, 284]} />
      <ForegroundShadow />
    </SceneFrame>
  );
}

function BeachScene({ p }) {
  return (
    <SceneFrame>
      <rect x="0" y="0" width="320" height="320" rx="28" fill={p.skyBottom} />
      <path
        d="M0 0 H320 V150 C250 160 190 162 130 156 C80 152 38 152 0 160 Z"
        fill={p.skyTop}
      />
      <circle cx="258" cy="58" r="20" fill={p.sunMoon} opacity="0.85" />

      <rect x="0" y="170" width="320" height="56" fill={p.accent} opacity="0.8" />
      <path
        d="M0 186 C54 178 108 180 162 188 C220 196 270 196 320 190 V228 H0 Z"
        fill={p.mid}
        opacity="0.75"
      />
      <path
        d="M0 220 C52 214 110 216 168 224 C228 232 278 232 320 226 L320 320 L0 320 Z"
        fill={p.ground}
      />

      <path
        d="M0 236 C72 228 136 230 196 238 C246 244 288 244 320 240"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <ForegroundShadow />
    </SceneFrame>
  );
}

function AlleyScene({ p }) {
  return (
    <SceneFrame>
      <rect x="0" y="0" width="320" height="320" rx="28" fill={p.skyBottom} />

      <polygon points="0,0 84,0 58,320 0,320" fill={p.far} />
      <polygon points="320,0 236,0 262,320 320,320" fill={p.mid} />

      <rect x="120" y="0" width="80" height="84" fill={p.skyTop} opacity="0.75" />

      <rect x="22" y="58" width="10" height="18" rx="2" fill={p.accent} opacity="0.55" />
      <rect x="34" y="58" width="10" height="18" rx="2" fill={p.accent} opacity="0.4" />
      <rect x="268" y="92" width="10" height="18" rx="2" fill={p.accent} opacity="0.55" />
      <rect x="280" y="92" width="10" height="18" rx="2" fill={p.accent} opacity="0.4" />

      <polygon
        points="74,320 246,320 214,182 106,182"
        fill={p.ground}
      />
      <path
        d="M148 320 L160 182 L172 320"
        stroke={p.detail}
        strokeWidth="4"
        opacity="0.32"
      />

      <ForegroundShadow />
    </SceneFrame>
  );
}

function RoadScene({ p }) {
  return (
    <SceneFrame>
      <Sky p={p} />

      {/* distant mountains */}
      <polygon
        points="0,182 54,146 98,172 144,138 192,176 238,144 286,174 320,156 320,320 0,320"
        fill={p.far}
        opacity="0.72"
      />

      {/* midground hills */}
      <path
        d="M0 198 C48 186 92 186 132 196 C176 208 222 208 320 192 L320 320 L0 320 Z"
        fill={p.mid}
        opacity="0.88"
      />

      {/* road shoulders / ground */}
      <path
        d="M0 236 C72 226 136 228 194 236 C244 242 284 242 320 238 L320 320 L0 320 Z"
        fill={p.near}
      />

      {/* main road */}
      <polygon
        points="126,320 194,320 178,200 142,200"
        fill={p.ground}
      />

      {/* center stripe */}
      <path
        d="M160 176 L160 190"
        stroke={p.accent}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M160 202 L160 216"
        stroke={p.accent}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M160 228 L160 242"
        stroke={p.accent}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M160 254 L160 268"
        stroke={p.accent}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M160 280 L160 294"
        stroke={p.accent}
        strokeWidth="4"
        strokeLinecap="round"
      />

      <ForegroundShadow />
    </SceneFrame>
  );
}

function RoomDetailedScene({ p }) {
  return (
    <SceneFrame>
      <rect x="0" y="0" width="320" height="320" rx="28" fill={p.skyTop} />
      <rect x="0" y="208" width="320" height="112" fill={p.mid} />
      <rect x="0" y="246" width="320" height="74" fill={p.ground} />

      <rect
        x="36"
        y="64"
        width="92"
        height="82"
        fill={p.accent}
        opacity=".8"
        stroke={p.detail}
        strokeWidth="4"
        rx="4"
      />
      <line x1="82" y1="64" x2="82" y2="146" stroke={p.detail} strokeWidth="3" opacity="0.55" />
      <line x1="36" y1="105" x2="128" y2="105" stroke={p.detail} strokeWidth="3" opacity="0.55" />

      <rect x="220" y="106" width="14" height="40" fill={p.detail} opacity="1" rx="4" />
      <circle cx="227" cy="94" r="18" fill={p.sunMoon} opacity="0.85" />
      <circle cx="227" cy="94" r="28" fill={p.accent} opacity="0.1" />

      <rect x="48" y="196" width="102" height="40" rx="10" fill={p.detail} opacity="1" />
      <rect x="54" y="170" width="88" height="24" rx="4" fill={p.near} opacity="1" />
      <rect x="52" y="226" width="8" height="22" fill={p.detail} opacity="1" />
      <rect x="138" y="226" width="8" height="22" fill={p.detail} opacity="1" />

      <ForegroundShadow />
    </SceneFrame>
  );
}

const SCENE_MAP = {
  mountain: MountainScene,
  forest: ForestScene,
  waterfall: WaterfallScene,
  desert: DesertScene,
  roomDetailed: RoomDetailedScene,
  park: ParkScene,
  cliff: CliffScene,
  city: CityScene,
  alley: AlleyScene,
  river: RiverScene,
  road: RoadScene,
  canyon: CanyonScene,
  lake: LakeScene,
  beach: BeachScene,
  nightHill: NightHillScene,
};


export default function InteroLandscapeScene({ sceneType, palette }) {
  const SceneComponent = SCENE_MAP[sceneType] || ForestScene;
  return <SceneComponent p={palette} />;
}
