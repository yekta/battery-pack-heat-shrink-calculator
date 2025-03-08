import { TBattery } from "@/lib/constants";
import { useMemo } from "react";
import * as THREE from "three";

type Props = {
  battery: TBattery;
  x: number;
  y: number;
};

export default function Battery({ x, y, battery }: Props) {
  // Create a custom beveled battery profile
  const points = useMemo(() => {
    const radius = battery.diameter / 2;
    const length = battery.length;
    const bevelSize = radius * 0.125;

    // Create points for a beveled cylinder profile
    // Starting from bottom center, going right and then up
    return [
      // Start at the bottom center
      new THREE.Vector2(0, -length / 2),
      // Bottom right corner (with bevel)
      new THREE.Vector2(radius - bevelSize, -length / 2),
      new THREE.Vector2(radius, -length / 2 + bevelSize),
      // Straight side
      new THREE.Vector2(radius, length / 2 - bevelSize),
      // Top right corner (with bevel)
      new THREE.Vector2(radius - bevelSize, length / 2),
      // End at the top center
      new THREE.Vector2(0, length / 2),
    ];
  }, [battery.diameter, battery.length]);

  const bottomPoints = useMemo(() => {
    const radius = battery.diameter / 2 - 2;
    const length = battery.length;
    const bevelSize = radius * 0.125;

    // Create points for a beveled cylinder profile
    // Starting from bottom center, going right and then up
    return [
      // Start at the bottom center
      new THREE.Vector2(0, -length / 2),
      // Bottom right corner (with bevel)
      new THREE.Vector2(radius - bevelSize, -length / 2),
      new THREE.Vector2(radius, -length / 2 + bevelSize),
      // Straight side
      new THREE.Vector2(radius, length / 2 - bevelSize),
      // Top right corner (with bevel)
      new THREE.Vector2(radius - bevelSize, length / 2),
      // End at the top center
      new THREE.Vector2(0, length / 2),
    ];
  }, [points]);

  const topPointsBlack = useMemo(() => {
    const radius = battery.diameter / 2 - 2.5;
    const length = battery.length;
    const bevelSize = radius * 0.125;

    // Create points for a beveled cylinder profile
    // Starting from bottom center, going right and then up
    return [
      // Start at the bottom center
      new THREE.Vector2(0, -length / 2),
      // Bottom right corner (with bevel)
      new THREE.Vector2(radius - bevelSize, -length / 2),
      new THREE.Vector2(radius, -length / 2 + bevelSize),
      // Straight side
      new THREE.Vector2(radius, length / 2 - bevelSize),
      // Top right corner (with bevel)
      new THREE.Vector2(radius - bevelSize, length / 2),
      // End at the top center
      new THREE.Vector2(0, length / 2),
    ];
  }, [points]);

  const topPointsWhite = useMemo(() => {
    const radius = battery.diameter / 2 - 5;
    const length = battery.length;
    const bevelSize = radius * 0.125;

    // Create points for a beveled cylinder profile
    // Starting from bottom center, going right and then up
    return [
      // Start at the bottom center
      new THREE.Vector2(0, -length / 2),
      // Bottom right corner (with bevel)
      new THREE.Vector2(radius - bevelSize, -length / 2),
      new THREE.Vector2(radius, -length / 2 + bevelSize),
      // Straight side
      new THREE.Vector2(radius, length / 2 - bevelSize),
      // Top right corner (with bevel)
      new THREE.Vector2(radius - bevelSize, length / 2),
      // End at the top center
      new THREE.Vector2(0, length / 2),
    ];
  }, [points]);

  return (
    <group position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <latheGeometry args={[points, 64]} />
        <meshStandardMaterial
          color="#4ade80"
          metalness={0.4}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <latheGeometry args={[bottomPoints, 64]} />
        <meshStandardMaterial
          color="#fff"
          metalness={0.4}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <latheGeometry args={[topPointsBlack, 64]} />
        <meshStandardMaterial
          color="#000"
          metalness={0.4}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <latheGeometry args={[topPointsWhite, 64]} />
        <meshStandardMaterial
          color="#fff"
          metalness={0.4}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
    </group>
  );
}
