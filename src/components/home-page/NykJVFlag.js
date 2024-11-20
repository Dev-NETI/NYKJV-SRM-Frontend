"use client";
import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function NykJVFlag(props) {
  const group = useRef(null);
  const { nodes, materials, animations } = useGLTF(
    "/assets/NYKJV-Animated-Logo/nykfil flag.glb"
  );
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions["Key.001Action"]?.play();
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Cylinder"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder.geometry}
          material={materials["Brushed metal"]}
          morphTargetDictionary={nodes.Cylinder.morphTargetDictionary}
          morphTargetInfluences={nodes.Cylinder.morphTargetInfluences}
        />
        <mesh
          name="Plane"
          castShadow
          receiveShadow
          geometry={nodes.Plane.geometry}
          material={materials["Fabric.002"]}
          morphTargetDictionary={nodes.Plane.morphTargetDictionary}
          morphTargetInfluences={nodes.Plane.morphTargetInfluences}
        />
        <group
          name="Wind"
          position={[13.019, 4.232, -0.123]}
          rotation={[1.759, 0.026, 1.585]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/assets/NYKJV-Animated-Logo/nykfil flag.glb");
