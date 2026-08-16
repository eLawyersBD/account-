import { useEffect } from 'react';
import { updateDocumentMetadata, ActiveMetadataState } from '../utils/updateDocumentMetadata';

/**
 * Custom hook to trigger dynamic document title and meta description updates
 * whenever the active section or modal states change.
 */
export function useDocumentMetadata(state: ActiveMetadataState): void {
  useEffect(() => {
    updateDocumentMetadata(state);
  }, [
    state.activeSection,
    state.isConsultationModalOpen,
    state.consultationMode,
    state.isHealthAssessmentOpen,
    state.articleTitle,
    state.isShortcutsModalOpen,
    state.isSearchModalOpen,
  ]);
}
