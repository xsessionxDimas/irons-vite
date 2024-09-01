// CBM Type yg bisa memakai CbmManual:
// - Manual
// - Normal
export type CbmManual = {
  taskNo: string;
  measurementLocation: string;
  uom: string;
  measurementRating: string;
  images: string;
};

// CBM Type yg bisa memakai CbmAutomatic:
// - Automatic
// - Automatic Previous
// - Birana
// - Dropdown Tool
export type CbmAutomatic = {
  taskNo: string;
  measurementLocation: string;
  uom: string;
  measurementValue: string;
  measurementRating: string;
  images: string;
};

export type AverageValue = {
  measurementValue: string;
  measurementRating: string;
  uom: string;
  images: ImagesItem[];
};

export type ImagesItem = {
  filename: string;
  description: string;
};

export type CbmAverage = {
  taskNo: string;
  measurementLocation: string;
  uom: string;
  value: AverageValue[];
};
export type AvgKey = {
  camera: string;
  rating: string;
  measurement: string;
  value: string;
};

// CBM Oil Cooled
export type CbmOilCooled = {
  taskNo: string;
  measurementLocation: string;
  tool: string;
  pistonMovementA: string;
  pistonMovementB: string;
  pistonMovementResult: string;
  uom: string;
  pistonMovementRating: string;
  rating: string;
  images: string;
};
export type OilCooledKey = {
  pistonMovementA: string;
  pistonMovementB: string;
  pistonMovementResult: string;
  uom: string;
  pistonMovementRating: string;
  rating: string;
  camera: string;
};
