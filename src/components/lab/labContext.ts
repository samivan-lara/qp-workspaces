import { createContext } from 'react';

export type LabDragVariant = 1 | 2;

export type LabNewWorkspaceVariant = 1 | 2;

export interface LabContextValue {
  dragVariant: LabDragVariant;
  setDragVariant: (variant: LabDragVariant) => void;
  newWorkspaceVariant: LabNewWorkspaceVariant;
  setNewWorkspaceVariant: (variant: LabNewWorkspaceVariant) => void;
}

export const DEFAULT_DRAG_VARIANT: LabDragVariant = 1;

export const DEFAULT_NEW_WORKSPACE_VARIANT: LabNewWorkspaceVariant = 1;

export const LabContext = createContext<LabContextValue>({
  dragVariant: DEFAULT_DRAG_VARIANT,
  setDragVariant: () => {},
  newWorkspaceVariant: DEFAULT_NEW_WORKSPACE_VARIANT,
  setNewWorkspaceVariant: () => {},
});