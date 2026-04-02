import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

const GradientOrbs = () => {
  return (
    <ShaderGradientCanvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      pointerEvents="none"
      pixelDensity={1}
      fov={45}
      lazyLoad={false}
    >
      <ShaderGradient
        control="props"
        type="waterPlane"
        color1="#D8572A"
        color2="#BD9261"
        color3="#F9F7F2"
        animate="on"
        uSpeed={0.08}
        uStrength={1.5}
        uDensity={1.2}
        uFrequency={5.5}
        uAmplitude={0.3}
        grain="on"
        grainBlending={3}
        brightness={1.0}
        lightType="3d"
        envPreset="dawn"
        cDistance={3.6}
        cPolarAngle={90}
        cAzimuthAngle={180}
        cameraZoom={1}
        positionX={0}
        positionY={0}
        positionZ={0}
        rotationX={0}
        rotationY={0}
        rotationZ={-60}
        reflection={0.1}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  );
};

export default GradientOrbs;
