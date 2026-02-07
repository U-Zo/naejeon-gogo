import { createServerFn } from '@tanstack/react-start';

export const verifyAdminPassword = createServerFn({ method: 'POST' })
  .inputValidator((password: string) => password)
  .handler(async ({ data: password }) => {
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'adminadmin';
    return { success: password === adminPassword };
  });
