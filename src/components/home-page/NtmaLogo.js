import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useSprings, animated } from "@react-spring/three";
import * as THREE from "three";

export function NtmaLogo(props) {
  const { nodes, materials } = useGLTF(
    "/assets/NYKJV-Animated-Logo/ntmalogo.glb"
  );

  // Extract mesh data
  const meshes = Object.keys(nodes)
    .filter((key) => nodes[key].isMesh)
    .map((key) => {
      const mesh = nodes[key];
      return {
        name: key,
        geometry: mesh.geometry,
        material: mesh.material,
        position: [mesh.position.x, mesh.position.y, mesh.position.z],
        rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
        scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
        isStatic: false, // Will determine static status below
      };
    });

  // Determine static meshes
  const animatedMeshes = meshes.map((mesh) => {
    const isStatic =
      mesh.position.every((value) => value === 0) &&
      mesh.rotation.every((value) => value === 0) &&
      mesh.scale.every((value) => value === 1);

    return { ...mesh, isStatic };
  });

  // Create animation springs
  const [springs, api] = useSprings(
    animatedMeshes.length,
    (index) => {
      const mesh = animatedMeshes[index];
      const config = {
        duration: 2200,
        easing: (t) => t, // Linear easing
      };

      return {
        to: {
          position: mesh.position,
          rotation: mesh.rotation,
          scale: mesh.scale,
        },
        from: mesh.isStatic
          ? {
              position: mesh.position,
              rotation: mesh.rotation,
              scale: mesh.scale,
            }
          : {
              position: [
                mesh.position[0] + (Math.random() - 0.5) * 20,
                mesh.position[1] + (Math.random() - 0.5) * 20,
                mesh.position[2] + (Math.random() - 0.5) * 20,
              ],
              rotation: [
                mesh.rotation[0] + Math.PI * (Math.random() - 0.5),
                mesh.rotation[1] + Math.PI * (Math.random() - 0.5),
                mesh.rotation[2] + Math.PI * (Math.random() - 0.5),
              ],
              scale: [0, 0, 0],
            },
        delay: mesh.isStatic ? 0 : index * 20, // No delay for static meshes
        config,
      };
    },
    [animatedMeshes]
  );

  useEffect(() => {
    api.start(); // Start the animation
  }, [api]);

  return (
    <group {...props} dispose={null}>
      {springs.map((spring, index) => (
        <animated.mesh
          key={animatedMeshes[index].name}
          geometry={animatedMeshes[index].geometry}
          material={animatedMeshes[index].material}
          position={spring.position}
          rotation={spring.rotation}
          scale={spring.scale}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

useGLTF.preload("/assets/NYKJV-Animated-Logo/ntmalogo.glb");
