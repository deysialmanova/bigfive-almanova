'use client';

import { Button } from '@nextui-org/button';
import { useEffect, useState } from 'react';

export const WhatsAppFloatingButton = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const message = `Oi, Deysi, realizei o mapeamento de personalidade e estes são os meus resultados! ${url}`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=5511919677918&text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      <Button
        as="a"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        color="success"
        size="lg"
        className="font-semibold text-white shadow-lg flex items-center gap-2 hover:scale-105 transition-transform duration-200 bg-[#25D366] hover:bg-[#1ebe57]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.907h.003c4.37 0 7.927-3.558 7.93-7.927a7.9 7.9 0 0 0-2.326-5.65m-5.61 10.53h-.005a6.97 6.97 0 0 1-3.57-.981l-.256-.152-2.5 1.25.642-2.457-.167-.266a6.98 6.98 0 0 1-1.067-3.64c.003-3.834 3.125-6.955 6.963-6.955a6.97 6.97 0 0 1 4.928 2.04 6.97 6.97 0 0 1 2.038 4.931c-.003 3.833-3.12 6.954-6.956 6.954m3.676-5.062c-.201-.1-.403-.08-.58-.1-.177 0-.387-.04-.504.098-.117.138-.45.44-.45.986 0 .546.4 1.075.456 1.15.056.074.787 1.2 1.907 2.18 1.12.98 1.885 1.026 2.186 1.054.3.028.98-.38 1.117-.745.138-.366.138-.68.096-.744-.04-.064-.176-.1-.377-.2z" />
        </svg>
        Enviar resultado à terapeuta Deysi Dias
      </Button>
    </div>
  );
};
