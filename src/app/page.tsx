import { redirect } from 'next/navigation';

const defaultLocale = 'en';

// Root page - redirect to default locale
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
