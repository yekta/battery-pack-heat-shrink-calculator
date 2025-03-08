export type TBatteryType = "18650" | "21700";

export type TBattery = {
  diameter: number;
  length: number;
};

export type TBatteryDimensions = {
  "18650": TBattery;
  "21700": TBattery;
};

export const BATTERY_DIMENSIONS: TBatteryDimensions = {
  "18650": { diameter: 18, length: 65 },
  "21700": { diameter: 21, length: 70 },
};

export type TOrientation = "x" | "y" | "z";
