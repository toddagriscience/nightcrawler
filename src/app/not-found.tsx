import { Footer, Header } from '@/components/ui';
import { Button } from '@/components/common';
export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-end justify-start p-8 md:p-16 pb-16 md:pb-24 ${inter.className} bg-[#F7F4EC]">
        <div className="flex flex-col md:flex-row items-end gap-8 md:gap-16 max-w-8xl">
          <div className="text-[120px] md:text-[240px] font-light leading-none text-[#555555] mb-4 md:mb-8">
            404
          </div>
          <div className="flex flex-col items-start gap-8 max-w-3x1">
            <p className="text-1x2 md:text-[32px] text-[#555555] font-light leading-normal">
              The page you are looking for could not be found. Please check the
              URL and try again.
            </p>
            <Button text="Home" href="/" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
