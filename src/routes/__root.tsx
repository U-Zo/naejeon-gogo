import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { OverlayProvider } from 'overlay-kit';
import { AuthProvider } from '#/client/domains/auth';
import { Layout } from '#/client/components/Layout';
import '../client/styles/global.css';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: '내전고고 - 5v5 내전 매칭' },
      { property: 'og:title', content: '내전고고 - 5v5 내전 매칭' },
      { property: 'og:description', content: 'MMR, 포지션 기반 자동 밸런싱 5v5 내전' },
      { property: 'og:type', content: 'website' },
      { name: 'theme-color', content: '#c8aa6e' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css',
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <AuthProvider>
          <Layout>
            <Outlet />
          </Layout>
        </AuthProvider>
      </OverlayProvider>
    </QueryClientProvider>
  );
}
