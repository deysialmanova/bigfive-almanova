import { Link } from '../navigation';
import { Logo } from '@/components/icons';
import { Link as NextUILink } from '@nextui-org/link';

interface FooterProps {
  footerLinks: {
    label: string;
    href: string;
  }[];
}

export default function Footer({ footerLinks }: FooterProps) {
  return (
    <footer className='w-full bg-[#871217] text-white py-12 mt-16 rounded-t-2xl border-t-4 border-[#FFBA1F] shadow-lg'>
      <div className='container mx-auto max-w-7xl px-6'>
        <div className='flex justify-between items-center'>
          <div className='w-full text-center'>
            <Logo size={42} className="text-[#FFBA1F] mx-auto" />
          </div>
        </div>

        {/* Ícones de Redes Sociais (ocultados na impressão/PDF) */}
        <div className='w-full flex justify-center gap-6 mt-6 print:hidden'>
          <NextUILink
            isExternal
            href="https://api.whatsapp.com/send?phone=5511919677918"
            aria-label='WhatsApp'
            className="text-white/80 hover:text-[#25D366] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.907h.003c4.37 0 7.927-3.558 7.93-7.927a7.9 7.9 0 0 0-2.326-5.65m-5.61 10.53h-.005a6.97 6.97 0 0 1-3.57-.981l-.256-.152-2.5 1.25.642-2.457-.167-.266a6.98 6.98 0 0 1-1.067-3.64c.003-3.834 3.125-6.955 6.963-6.955a6.97 6.97 0 0 1 4.928 2.04 6.97 6.97 0 0 1 2.038 4.931c-.003 3.833-3.12 6.954-6.956 6.954m3.676-5.062c-.201-.1-.403-.08-.58-.1-.177 0-.387-.04-.504.098-.117.138-.45.44-.45.986 0 .546.4 1.075.456 1.15.056.074.787 1.2 1.907 2.18 1.12.98 1.885 1.026 2.186 1.054.3.028.98-.38 1.117-.745.138-.366.138-.68.096-.744-.04-.064-.176-.1-.377-.2z"/>
            </svg>
          </NextUILink>
          <NextUILink
            isExternal
            href="https://www.linkedin.com/in/deysianedias/"
            aria-label='LinkedIn'
            className="text-white/80 hover:text-[#0A66C2] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
            </svg>
          </NextUILink>
          <NextUILink
            isExternal
            href="https://www.instagram.com/deysi.almanova/"
            aria-label='Instagram'
            className="text-white/80 hover:text-[#E1306C] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.917 3.917 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.999 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
            </svg>
          </NextUILink>
        </div>

        <div className='w-full flex justify-center mt-6 print:hidden'>
          <ul className='flex mt-3 text-sm font-medium text-white/80 sm:mt-0'>
            {footerLinks.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className='hover:underline me-4 md:me-6 hover:text-[#FFBA1F] transition-colors'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col md:flex-row text-xs text-white/70 sm:py-2 mt-6 justify-center items-center gap-1.5 text-center'>
          <span className="font-semibold text-[#FFBA1F]">CNPJ: 66.862.265/0001-07</span>
          <span className="hidden md:inline text-white/40">|</span>
          <span>© 2026 Almanova — Consciência, Identidade e Propósito. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
