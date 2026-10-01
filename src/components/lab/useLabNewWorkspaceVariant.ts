import { useContext } from 'react';
import { LabContext, type LabNewWorkspaceVariant } from './labContext';

export function useLabNewWorkspaceVariant(): LabNewWorkspaceVariant {
  return useContext(LabContext).newWorkspaceVariant;
}