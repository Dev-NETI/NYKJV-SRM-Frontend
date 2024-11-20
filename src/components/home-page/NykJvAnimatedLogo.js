"use client";
import React from "react";
import NykJVFlag from "./NykJVFlag";
import NetiLogo from "./NetiLogo";
import { NtmaLogo } from "./NtmaLogo";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, SoftShadows } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

function NykJvAnimatedLogo() {
  return (
    <div className="basis-6/12 p-10">
      <Canvas
        shadows
        style={{
          width: "100%",
          height: "670px",
          position: "relative",
          margin: "0 auto",
        }}
        camera={{ position: [0, 0, 17], fov: 60 }}
      >
        <SoftShadows />
        <Environment preset="forest" />
        <OrbitControls enableZoom={false} />

        {/* Lights */}
        <directionalLight
          castShadow
          position={[2.5, 8, 5]}
          intensity={1.5}
          shadow-mapSize={1024}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-10, 10, -10, 10, 0.1, 50]}
          />
        </directionalLight>
        <pointLight position={[-10, 0, 10]} color="white" intensity={12} />
        <pointLight position={[0, 10, 0]} intensity={1} />
        <ambientLight intensity={0.5} />

        <NykAnimatedFlag />
        <NetiAnimatedLogo />
        <NtmaAnimatedLogo />

        {/* Ground Plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -8, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial transparent opacity={0.4} />
        </mesh>

        {/* Post-Processing Effects */}
        <EffectComposer>
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

const NykAnimatedFlag = () => {
  return (
    <mesh
      scale={2}
      position={[-10, -8, 1]}
      rotation={[0, -Math.PI / 2, 0]}
      receiveShadow
      castShadow
    >
      <NykJVFlag />
    </mesh>
  );
};

const NetiAnimatedLogo = () => {
  return (
    <mesh scale={2} position={[-5, -6, 0]} receiveShadow castShadow>
      <NetiLogo />
    </mesh>
  );
};

const NtmaAnimatedLogo = () => {
  return (
    <mesh
      scale={2}
      position={[2, -5.7, 0]}
      rotation={[0, 12, 0]}
      receiveShadow
      castShadow
    >
      <NtmaLogo />
    </mesh>
  );
};

export default NykJvAnimatedLogo;
