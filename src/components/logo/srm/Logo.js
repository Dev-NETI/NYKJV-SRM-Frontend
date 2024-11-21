import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  Float,
  Text3D,
  Center,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import { gsap } from "gsap";
import { useEffect } from "react";

const Logo = () => {
  const groupRef = useRef();
  const spotlightRef = useRef();
  const texture = useTexture("/SRM.png");
  const meshRefs = useRef([]);

  // Initialize animation on mount
  useEffect(() => {
    // Reset positions
    meshRefs.current.forEach((mesh) => {
      if (mesh) {
        // Start fully transparent
        mesh.material.opacity = 0;

        // Simple fade in animation
        gsap.to(mesh.material, {
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
        });
      }
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Subtle scale animation
    const scale = 1 + Math.sin(time * 1.2) * 0.02;
    groupRef.current.scale.set(scale, scale, scale);

    // Enhanced spotlight animation
    if (spotlightRef.current) {
      const radius = 2;
      const speed = 1;
      spotlightRef.current.position.x = Math.sin(time * speed) * radius;
      spotlightRef.current.position.y = Math.cos(time * speed) * radius;
      spotlightRef.current.position.z = 6 + Math.sin(time * 0.5);
      spotlightRef.current.intensity = 4 + Math.sin(time * 1) * 0.5;
    }
  });

  const addToRefs = (mesh) => {
    if (mesh && !meshRefs.current.includes(mesh)) {
      meshRefs.current.push(mesh);
    }
  };

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.3}
      floatingRange={[-0.05, 0.05]}
    >
      <group ref={groupRef} scale={0.4}>
        {/* Front face with logo */}
        <mesh position={[0, 0, 0.05]} receiveShadow castShadow ref={addToRefs}>
          <boxGeometry args={[4, 2, 0.02]} />
          <meshPhysicalMaterial
            map={texture}
            transparent
            metalness={0.3}
            roughness={0.2}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
            alphaTest={0.5}
            depthWrite={true}
            opacity={0}
          />
        </mesh>

        {/* Thin backing layer */}
        <mesh position={[0, 0, 0]} receiveShadow ref={addToRefs}>
          <boxGeometry args={[4, 2, 0.05]} />
          <meshPhysicalMaterial
            map={texture}
            transparent
            metalness={0.4}
            roughness={0.2}
            clearcoat={0.3}
            alphaTest={0.3}
            color="#f8f8f8"
            opacity={0}
          />
        </mesh>

        {/* Side edges */}
        <group>
          <mesh position={[0, 0, -0.01]} receiveShadow ref={addToRefs}>
            <boxGeometry args={[4, 2, 0.08]} />
            <meshPhysicalMaterial
              map={texture}
              transparent
              alphaTest={0.2}
              color="#e8e8e8"
              metalness={0.3}
              roughness={0.2}
              clearcoat={0.2}
              opacity={0}
            />
          </mesh>
        </group>
      </group>

      {/* Enhanced spotlight */}
      <spotLight
        ref={spotlightRef}
        position={[0, 0, 8]}
        angle={0.5}
        penumbra={0.8}
        intensity={2}
        distance={15}
        color="#ffffff"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.001}
      />

      {/* Additional rim light for better definition */}
      <pointLight position={[0, 0, -5]} intensity={0.5} color="#ffffff" />
    </Float>
  );
};

const LogoCanvas = ({
  height = "650px",
  width = "650px",
  margin = "0 auto",
  position,
  top,
  left,
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{
        height: height,
        width: width,
        margin: margin,
        background: "transparent",
        position: position,
        top: top,
        left: left,
      }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      }}
      shadows
    >
      {/* Adjusted lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.2} castShadow />
      <directionalLight position={[-5, -5, -5]} intensity={0.1} />

      <Suspense fallback={null}>
        <Logo />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
};

export default LogoCanvas;
