import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 80;

// Warm palette: coral, amber, beige, soft peach
const COLORS = [
  new THREE.Color('hsl(18, 76%, 60%)'),   // coral
  new THREE.Color('hsl(30, 50%, 65%)'),    // amber
  new THREE.Color('hsl(35, 40%, 75%)'),    // warm beige
  new THREE.Color('hsl(15, 60%, 55%)'),    // terracotta
  new THREE.Color('hsl(25, 45%, 70%)'),    // peach
];

const COLORS_DARK = [
  new THREE.Color('hsl(18, 70%, 55%)'),
  new THREE.Color('hsl(30, 55%, 55%)'),
  new THREE.Color('hsl(35, 35%, 60%)'),
  new THREE.Color('hsl(15, 55%, 50%)'),
  new THREE.Color('hsl(25, 40%, 60%)'),
];

function Particles({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { offsets, speeds, phases, colorIndices } = useMemo(() => {
    const o = new Float32Array(PARTICLE_COUNT * 3);
    const s = new Float32Array(PARTICLE_COUNT);
    const p = new Float32Array(PARTICLE_COUNT * 3);
    const c = new Uint8Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      o[i * 3] = (Math.random() - 0.5) * 24;
      o[i * 3 + 1] = (Math.random() - 0.5) * 16;
      o[i * 3 + 2] = (Math.random() - 0.5) * 8;
      s[i] = 0.03 + Math.random() * 0.06;
      p[i * 3] = Math.random() * Math.PI * 2;
      p[i * 3 + 1] = Math.random() * Math.PI * 2;
      p[i * 3 + 2] = Math.random() * Math.PI * 2;
      c[i] = Math.floor(Math.random() * COLORS.length);
    }
    return { offsets: o, speeds: s, phases: p, colorIndices: c };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    const palette = isDark ? COLORS_DARK : COLORS;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      meshRef.current.setColorAt(i, palette[colorIndices[i]]);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [isDark, colorIndices]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const speed = speeds[i];
      const ox = offsets[i * 3];
      const oy = offsets[i * 3 + 1];
      const oz = offsets[i * 3 + 2];
      const px = phases[i * 3];
      const py = phases[i * 3 + 1];
      const pz = phases[i * 3 + 2];

      dummy.position.set(
        ox + Math.sin(t * speed + px) * 2.5,
        oy + Math.cos(t * speed * 0.8 + py) * 2,
        oz + Math.sin(t * speed * 0.6 + pz) * 1.5
      );

      const scale = 0.04 + Math.sin(t * speed * 0.5 + px) * 0.02;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.25} toneMapped={false} />
    </instancedMesh>
  );
}

const GradientOrbs = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Three.js floating particles */}
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 12], fov: 50 }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        events={() => ({ enabled: false, priority: 0, compute: () => {} } as any)}
      >
        <Particles isDark={isDark} />
      </Canvas>

      {/* Large primary orb - top left */}
      <div
        className="absolute rounded-full animate-drift-slow"
        style={{
          width: '60vw',
          height: '60vw',
          maxWidth: '900px',
          maxHeight: '900px',
          top: '-15%',
          left: '-15%',
          background: isDark
            ? 'radial-gradient(circle, hsla(18, 70%, 50%, 0.25) 0%, transparent 60%)'
            : 'radial-gradient(circle, hsla(18, 76%, 48%, 0.28) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Secondary orb - right side */}
      <div
        className="absolute rounded-full animate-drift-medium"
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: '700px',
          maxHeight: '700px',
          top: '15%',
          right: '-10%',
          background: isDark
            ? 'radial-gradient(circle, hsla(30, 50%, 50%, 0.15) 0%, transparent 60%)'
            : 'radial-gradient(circle, hsla(30, 45%, 55%, 0.18) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Tertiary orb - bottom */}
      <div
        className="absolute rounded-full animate-drift-slow-reverse"
        style={{
          width: '55vw',
          height: '55vw',
          maxWidth: '800px',
          maxHeight: '800px',
          bottom: '-10%',
          left: '15%',
          background: isDark
            ? 'radial-gradient(circle, hsla(18, 60%, 55%, 0.18) 0%, transparent 60%)'
            : 'radial-gradient(circle, hsla(18, 60%, 58%, 0.22) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Small accent orb */}
      <div
        className="absolute rounded-full animate-drift-medium-reverse"
        style={{
          width: '35vw',
          height: '35vw',
          maxWidth: '500px',
          maxHeight: '500px',
          top: '55%',
          right: '10%',
          background: isDark
            ? 'radial-gradient(circle, hsla(18, 80%, 55%, 0.15) 0%, transparent 60%)'
            : 'radial-gradient(circle, hsla(18, 76%, 52%, 0.18) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
};

export default GradientOrbs;
