/**
 * Standalone Layout for Content Helper Development
 *
 * Minimal layout without app shell - for isolated testing
 */

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Content Helper - Dev</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f9fafb',
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  );
}
