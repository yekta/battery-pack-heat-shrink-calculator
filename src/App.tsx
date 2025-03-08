import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ShellIcon } from "lucide-react";
import { useState } from "react";
import { BatteryScene } from "./components/BatteryScene";

type BatteryType = "18650" | "21700";

type BatteryDimensions = {
  "18650": { diameter: number; length: number };
  "21700": { diameter: number; length: number };
};

const BATTERY_DIMENSIONS: BatteryDimensions = {
  "18650": { diameter: 18, length: 65 },
  "21700": { diameter: 21, length: 70 },
};

type Orientation = "x" | "y" | "z";

function App() {
  const [batteryType, setBatteryType] = useState<BatteryType>("18650");
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(3);
  const [shrinkFactor, setShrinkFactor] = useState(0.5);
  const leeway = 10;

  const battery = BATTERY_DIMENSIONS[batteryType];

  // Calculate pack dimensions
  const width = battery.diameter * columns;
  const height = battery.diameter * rows;
  const length = battery.length;

  // Calculate diameters for each orientation based on hypotenuse
  const surfaceArea = {
    x: {
      width: length,
      height: height,
      area: height * length,
    },
    y: {
      width: width,
      height: length,
      area: width * length,
    },
    z: {
      width: width,
      height: height,
      area: width * height,
    },
  };

  // Find orientation with smallest diameter
  const orientationKey = Object.entries(surfaceArea).reduce((a, b) =>
    a[1].area < b[1].area ? a : b
  )[0] as Orientation;

  const tubeDiameter = getEnclosingCircleDiameter(
    rows,
    columns,
    battery,
    orientationKey
  );
  const tubeRadius = tubeDiameter / 2;
  const heatshrinkRadius = Math.sqrt((tubeRadius * tubeRadius) / shrinkFactor);
  const heatshrinkDiameter = heatshrinkRadius * 2;
  const heatshrinkLength =
    orientationKey === "z" ? length : orientationKey === "y" ? height : width;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-4 pb-[calc(1rem+6vh)]">
      <div className="w-full max-w-6xl flex flex-col items-center">
        <div className="w-full max-w-xl flex justify-center items-center gap-1.5 md:gap-2 mb-6 px-1">
          <ShellIcon className="size-6 md:size-8 shrink-0" />
          <h1 className="shrink min-w-0 text-lg md:text-2xl font-bold leading-tight">
            Battery Pack Heat Shrink Calculator
          </h1>
        </div>

        <div className="w-full flex-col items-center lg:items-stretch flex lg:flex-row justify-center gap-2">
          <Card className="p-4 pt-3 md:p-6 md:pt-5 max-w-md">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Battery Type</Label>
                <Select
                  value={batteryType}
                  onValueChange={(value: BatteryType) => setBatteryType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18650">18650</SelectItem>
                    <SelectItem value="21700">21700</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Rows: <span className="font-bold">{rows}</span>
                </Label>
                <Slider
                  value={[rows]}
                  onValueChange={(value) => setRows(value[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Columns: <span className="font-bold">{columns}</span>
                </Label>
                <Slider
                  value={[columns]}
                  onValueChange={(value) => setColumns(value[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Shrinks to: <span className="font-bold">{shrinkFactor}x</span>
                </Label>
                <Slider
                  value={[shrinkFactor]}
                  onValueChange={(value) => setShrinkFactor(value[0])}
                  min={0.1}
                  max={0.9}
                  step={0.1}
                />
              </div>

              <div className="w-full flex flex-col mt-8 p-4 bg-muted rounded-lg">
                <h3 className="w-full text-lg font-semibold mb-2 leading-tight">
                  Recommended Heat Shrink Diameter:{" "}
                  <span className="text-red-600">
                    {Math.ceil(heatshrinkDiameter)}mm
                  </span>
                </h3>
                <div className="w-full flex flex-col">
                  <p className="text-muted-foreground">
                    Minimum Tube Diameter:{" "}
                    <span className="font-mono text-blue-700 font-semibold">
                      {Math.ceil(tubeDiameter)}mm
                    </span>{" "}
                  </p>
                  <p className="text-muted-foreground">
                    Pack Size:{" "}
                    <span className="font-mono text-foreground font-semibold">
                      {width}mm × {height}mm × {length}mm
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="aspect-square w-full max-w-md">
            <BatteryScene
              batteryType={batteryType}
              rows={rows}
              columns={columns}
              leeway={leeway}
              heatshrinkDiameter={heatshrinkDiameter}
              heatshrinkOrientation={orientationKey}
              heatshrinkLength={heatshrinkLength}
              tubeDiameter={tubeDiameter}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function getEnclosingCircleDiameter(
  rows: number,
  columns: number,
  battery: BatteryDimensions[keyof BatteryDimensions],
  orientation: Orientation
): number {
  if (orientation === "x") {
    const triangleSide1 = (battery.diameter * rows) / 2;
    const triangleSide2 = battery.length / 2;
    const triangleHypotenuse = Math.sqrt(
      triangleSide1 ** 2 + triangleSide2 ** 2
    );
    return triangleHypotenuse * 2;
  }
  if (orientation === "y") {
    const triangleSide1 = (battery.diameter * columns) / 2;
    const triangleSide2 = battery.length / 2;
    const triangleHypotenuse = Math.sqrt(
      triangleSide1 ** 2 + triangleSide2 ** 2
    );
    return triangleHypotenuse * 2;
  }

  return (
    battery.diameter * (Math.sqrt((columns - 1) ** 2 + (rows - 1) ** 2) + 1)
  );
}

export default App;
