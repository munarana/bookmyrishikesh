export function useToast() {
  const toast = ({ title, description, variant }: { title: string, description?: string, variant?: string }) => {
    if (variant === 'destructive') {
      console.error(title, description);
      alert(`ERROR: ${title}\n${description || ''}`);
    } else {
      console.log(title, description);
      // For success, maybe don't alert to avoid annoyance, but console.log is fine
      // Or alert only if description is short
      // alert(`SUCCESS: ${title}\n${description || ''}`);
    }
  };

  return { toast };
}
