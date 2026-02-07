import { useState } from 'react';
import { overlay } from 'overlay-kit';
import { useAuth } from '#/client/domains/auth';
import * as styles from '#/client/components/AdminAuth.css';
import * as common from '#/client/styles/common.css';

function LockIcon() {
  return (
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UnlockIcon() {
  return (
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function AdminLoginDialog({
  isOpen,
  close,
  unmount,
  login,
}: {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
  login: (password: string) => Promise<{ success: boolean }>;
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    close();
    unmount();
  };

  const handleLogin = async () => {
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }
    setIsPending(true);
    setError('');
    const result = await login(password);
    setIsPending(false);
    if (result.success) {
      handleClose();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className={common.formOverlay} onClick={handleClose}>
      <div className={common.formSheet} onClick={(e) => e.stopPropagation()}>
        <div className={common.dialogHeader}>
          <h3 className={common.formTitle}>관리자 로그인</h3>
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

        <div className={common.fieldGroup}>
          <label className={common.label}>비밀번호</label>
          <input
            className={common.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="관리자 비밀번호"
            autoFocus
          />
        </div>

        {error && <p className={common.errorText}>{error}</p>}

        <div className={common.formActions}>
          <button className={common.buttonSecondary} style={{ flex: 1 }} onClick={handleClose}>
            취소
          </button>
          <button
            className={common.buttonPrimary}
            style={{ flex: 1 }}
            onClick={handleLogin}
            disabled={isPending}
          >
            {isPending ? '확인 중...' : '로그인'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminLoginButton() {
  const { isAdmin, login, logout } = useAuth();

  const openLoginDialog = () => {
    overlay.open(({ isOpen, close, unmount }) => (
      <AdminLoginDialog isOpen={isOpen} close={close} unmount={unmount} login={login} />
    ));
  };

  if (isAdmin) {
    return (
      <button className={styles.adminButton} data-active="true" onClick={logout}>
        <UnlockIcon />
      </button>
    );
  }

  return (
    <button className={styles.adminButton} onClick={openLoginDialog}>
      <LockIcon />
    </button>
  );
}
