import { useContext } from 'react';
import { LabContext, type LabDragVariant } from './labContext';

export function useLabDragVariant(): LabDragVariant {
  return useContext(LabContext).dragVariant;
}