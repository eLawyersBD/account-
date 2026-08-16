import { useEffect, useState } from 'react';

interface ShortcutHandlers {
  onConsultation: () => void;
  onMeeting: () => void;
  onHealthAssessment: () => void;
  onToggleShortcutsModal: () => void;
  onToggleSearch: () => void;
}

export function useKeyboardShortcuts({
  onConsultation,
  onMeeting,
  onHealthAssessment,
  onToggleShortcutsModal,
  onToggleSearch,
}: ShortcutHandlers) {
  const [lastShortcutTriggered, setLastShortcutTriggered] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K or Cmd+K always triggers search anywhere
      if ((event.ctrlKey || event.metaKey) && (event.key === 'k' || event.key === 'K')) {
        event.preventDefault();
        setLastShortcutTriggered('Shortcut: Global Search (Ctrl+K)');
        onToggleSearch();
        return;
      }

      // Ignore key events when user is typing in inputs, textareas, selects or contenteditable
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ignore if modifier keys like Ctrl, Alt, or Meta (Cmd) are held
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      const key = event.key;

      if (key === '/' || key === 's' || key === 'S') {
        event.preventDefault();
        setLastShortcutTriggered('Shortcut: Global Search (S)');
        onToggleSearch();
      } else if (key === 'c' || key === 'C') {
        event.preventDefault();
        setLastShortcutTriggered('Shortcut: Consultation (C)');
        onConsultation();
      } else if (key === 'm' || key === 'M') {
        event.preventDefault();
        setLastShortcutTriggered('Shortcut: Executive Meeting (M)');
        onMeeting();
      } else if (key === 'h' || key === 'H') {
        event.preventDefault();
        setLastShortcutTriggered('Shortcut: Health Assessment (H)');
        onHealthAssessment();
      } else if (key === '?' || (event.shiftKey && key === '/')) {
        event.preventDefault();
        setLastShortcutTriggered('Shortcut: Shortcuts Menu (?)');
        onToggleShortcutsModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onConsultation, onMeeting, onHealthAssessment, onToggleShortcutsModal, onToggleSearch]);

  // Clear toast feedback after 2 seconds
  useEffect(() => {
    if (lastShortcutTriggered) {
      const timer = setTimeout(() => {
        setLastShortcutTriggered(null);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [lastShortcutTriggered]);

  return { lastShortcutTriggered };
}
