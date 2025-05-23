import React from "react";
import { useGLTF } from "@react-three/drei";

export default function NetiLogo(props) {
  const { nodes, materials } = useGLTF(
    "/assets/NYKJV-Animated-Logo/netilogo.glb"
  );

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve001.geometry}
        material={materials["SVGMat.002"]}
        position={[-3.751, 0.473, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={20.821}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve002.geometry}
          material={materials["SVGMat.003"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve003.geometry}
          material={materials["SVGMat.004"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve009.geometry}
          material={materials["SVGMat.010"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve011.geometry}
          material={materials["SVGMat.012"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve013.geometry}
          material={materials["SVGMat.014"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve014.geometry}
          material={materials["SVGMat.015"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve015.geometry}
          material={materials["SVGMat.016"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve016.geometry}
          material={materials["SVGMat.017"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve017.geometry}
          material={materials["SVGMat.018"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve018.geometry}
          material={materials["SVGMat.019"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve019.geometry}
          material={materials["SVGMat.020"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve020.geometry}
          material={materials["SVGMat.021"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve021.geometry}
          material={materials["SVGMat.022"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve022.geometry}
          material={materials["SVGMat.023"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve023.geometry}
          material={materials["SVGMat.024"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve024.geometry}
          material={materials["SVGMat.025"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve025.geometry}
          material={materials["SVGMat.026"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve026.geometry}
          material={materials["SVGMat.027"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve027.geometry}
          material={materials["SVGMat.028"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve028.geometry}
          material={materials["SVGMat.029"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve029.geometry}
          material={materials["SVGMat.030"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve030.geometry}
          material={materials["SVGMat.031"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve031.geometry}
          material={materials["SVGMat.032"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve033.geometry}
          material={materials["SVGMat.034"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve034.geometry}
          material={materials["SVGMat.035"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Curve035.geometry}
          material={materials["SVGMat.036"]}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/assets/NYKJV-Animated-Logo/netilogo.glb");
