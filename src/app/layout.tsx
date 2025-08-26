// Root layout - required by Next.js App Router
// For i18n apps, this should just return children and let [locale]/layout handle HTML structure
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
