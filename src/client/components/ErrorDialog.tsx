import { overlay } from 'overlay-kit';
import * as styles from '#/client/components/ErrorDialog.css';
import * as common from '#/client/styles/common.css';

function ErrorDialogContent({
  isOpen,
  close,
  unmount,
  message,
}: {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
  message: string;
}) {
  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    close();
    unmount();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.content} role="alertdialog" onClick={(e) => e.stopPropagation()}>
        <div className={common.dialogHeader}>
          <p className={styles.title}>오류</p>
          <button className={common.closeButton} onClick={handleClose}>
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
        <button className={common.buttonPrimary} style={{ width: '100%' }} onClick={handleClose}>
          확인
        </button>
      </div>
    </div>
  );
}

export function openErrorDialog(message: string) {
  overlay.open(({ isOpen, close, unmount }) => (
    <ErrorDialogContent isOpen={isOpen} close={close} unmount={unmount} message={message} />
  ));
}
