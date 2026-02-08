import { overlay } from 'overlay-kit';
import * as styles from '#/client/components/ConfirmDialog.css';
import * as common from '#/client/styles/common.css';

function ConfirmDialogContent({
  isOpen,
  close,
  unmount,
  message,
}: {
  isOpen: boolean;
  close: (result: boolean) => void;
  unmount: () => void;
  message: string;
}) {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    close(true);
    unmount();
  };

  const handleCancel = () => {
    close(false);
    unmount();
  };

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.content} role="alertdialog" onClick={(e) => e.stopPropagation()}>
        <div className={common.dialogHeader}>
          <p className={styles.title}>확인</p>
          <button className={common.closeButton} onClick={handleCancel}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={common.buttonSecondary} style={{ flex: 1 }} onClick={handleCancel}>
            취소
          </button>
          <button className={common.buttonPrimary} style={{ flex: 1 }} onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export function openConfirmDialog(message: string): Promise<boolean> {
  return overlay.openAsync<boolean>(({ isOpen, close, unmount }) => (
    <ConfirmDialogContent isOpen={isOpen} close={close} unmount={unmount} message={message} />
  ));
}
