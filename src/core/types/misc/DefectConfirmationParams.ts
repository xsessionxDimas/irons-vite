export type CallbackFunction = (...args: any[]) => void;

export type DefectConfirmationParams = {
  headerId: string;
  reason: string;
  callback?: CallbackFunction;
};
