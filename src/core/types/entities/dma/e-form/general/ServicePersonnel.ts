export type ServicePersonnel = {
  key: string,
  mechanic: Mechanic,
  shift: string,
  serviceStart: string,
  serviceEnd: string
}

export type Mechanic = {
  id: string,
  name: string
}
