import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  id: string;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary' | 'warning';
  isOpen: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Reusable Bootstrap 5 confirmation modal.
 */
export function ConfirmModal({
  id,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  isOpen,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const bsModalRef = useRef<InstanceType<typeof import('bootstrap').Modal> | null>(null);

  useEffect(() => {
    const loadModal = async () => {
      if (modalRef.current && !bsModalRef.current) {
        const bootstrap = await import('bootstrap');
        bsModalRef.current = new bootstrap.Modal(modalRef.current, {
          backdrop: 'static',
          keyboard: false,
        });
      }
    };
    loadModal();
  }, []);

  useEffect(() => {
    if (bsModalRef.current) {
      if (isOpen) {
        bsModalRef.current.show();
      } else {
        bsModalRef.current.hide();
      }
    }
  }, [isOpen]);

  return (
    <div className="modal fade" ref={modalRef} id={id} tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body py-4">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-${confirmVariant}`}
              onClick={onConfirm}
              disabled={loading}
              id={`${id}-confirm-btn`}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processing…
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
