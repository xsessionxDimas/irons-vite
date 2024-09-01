import { Group } from "./Group"

export type Model = {
  psType5000?: Group[],
  psType4000?: Group[],
  psType2000?: Group[],
  psType1000?: Group[],
  psType500?: Group[],
  psType250?: Group[]
}

type KeysOfType<ModelType, Pattern extends string> = {
  [Key in keyof ModelType]: Key extends `${Pattern}${infer Rest}` ? Rest : never;
}[keyof ModelType];

export type AvailablePsType = KeysOfType<Model, 'psType'>;
