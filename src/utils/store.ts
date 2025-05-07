
// This is a compatibility file for transition to the new store structure
// It re-exports everything from the new store to maintain compatibility
export * from '../store';
export * from '../store/types';
export { useStore as default } from '../store';
