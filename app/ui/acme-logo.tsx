import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/font';

export default function FreemiumLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-col items-center justify-center leading-10  text-white`}
    >
      <GlobeAltIcon className=" h-6 w-6 md:h-12 md:w-12 rotate-[15deg]" />
      <p className=" text-[36px] md:text-[44px] ">Freelan</p>
    </div>
  );
}
