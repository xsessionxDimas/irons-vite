export type PriorityEmitParam = {
   priority: string;
   callback: ((...args: []) => void) | undefined;
}
