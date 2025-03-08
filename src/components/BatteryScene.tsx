import Battery from "@/components/Battery";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Euler } from "three";

interface BatterySceneProps {
  batteryType: "18650" | "21700";
  rows: number;
  columns: number;
  leeway: number;
  heatshrinkOrientation: "x" | "y" | "z";
  heatshrinkDiameter: number;
  heatshrinkLength: number;
  tubeDiameter: number;
}

const BATTERY_DIMENSIONS = {
  "18650": { diameter: 18, length: 65 },
  "21700": { diameter: 21, length: 70 },
};

function BatteryGroup({
  batteryType,
  rows,
  columns,
  leeway,
  heatshrinkOrientation,
  heatshrinkLength,
  heatshrinkDiameter,
  tubeDiameter,
}: BatterySceneProps) {
  const battery = BATTERY_DIMENSIONS[batteryType];

  // Create batteries with no gaps
  const batteries = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // Calculate position based on row and column
      const x = (col - (columns - 1) / 2) * battery.diameter;
      const y = (row - (rows - 1) / 2) * battery.diameter;

      batteries.push(
        <Battery key={`${row}-${col}`} battery={battery} x={x} y={y} />
      );
    }
  }

  // Calculate rotation based on orientation
  const heatshrinkRotation = getHeatshrinkRotation(heatshrinkOrientation);
  const heatshrinkFinalLength = heatshrinkLength + leeway;
  return (
    <group>
      {/* Heat shrink tube */}
      <mesh rotation={heatshrinkRotation}>
        <cylinderGeometry
          args={[
            heatshrinkDiameter / 2,
            heatshrinkDiameter / 2,
            heatshrinkFinalLength,
            32,
            1,
            true,
          ]}
        />
        <meshPhysicalMaterial
          color="#ff0000"
          transparent={true}
          opacity={0.3}
          roughness={0.5}
          metalness={0}
          side={2}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={heatshrinkRotation}>
        <cylinderGeometry
          args={[
            (tubeDiameter + 0.1) / 2,
            (tubeDiameter + 0.1) / 2,
            heatshrinkFinalLength,
            32,
            1,
            true,
          ]}
        />
        <meshPhysicalMaterial
          color="#304BE2"
          transparent={true}
          opacity={0.25}
          roughness={0.5}
          metalness={0}
          side={2}
          depthWrite={false}
        />
      </mesh>

      {/* Batteries */}
      {batteries}
    </group>
  );
}

export function BatteryScene(props: BatterySceneProps) {
  return (
    <Canvas
      camera={{ position: [150, 75, 200], fov: 45 }}
      style={{ background: "transparent" }}
      shadows
    >
      {/* Enhanced lighting for better shadows */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[50, 50, 50]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <pointLight position={[-30, 30, 30]} intensity={0.5} castShadow />

      {/* Add subtle environment lighting */}
      <Environment preset="sunset" />

      {/* <axesHelper args={[100]} /> */}
      <BatteryGroup {...props} />
      <OrbitControls minDistance={100} maxDistance={600} enablePan={false} />
      <gridHelper args={[100000, 5000]} />
    </Canvas>
  );
}

function getHeatshrinkRotation(orientation: "x" | "y" | "z"): Euler {
  switch (orientation) {
    case "x":
      // Align with X axis
      return new Euler(0, 0, Math.PI / 2);
    case "y":
      // Align with Z axis (default cylinder orientation in Three.js)
      return new Euler(0, 0, 0);
    case "z":
      // Align with Y axis
      return new Euler(Math.PI / 2, 0, 0);
    default:
      return new Euler(0, 0, 0);
  }
}
