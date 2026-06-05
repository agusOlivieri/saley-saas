import Image from 'next/image';
import logoImg from '@/app/assets/images/saley_logo.png';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "flex gap-1", size = 40 }: LogoProps) {
  return (
    <div className={className}>
      <Image src={logoImg} alt="Logo" width={size} height={size} />
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-blue-950 leading-none">Saley</h1>
        <span className="text-[12px] text-gray-500">para Comercios</span>
      </div>
    </div>
  );
}
