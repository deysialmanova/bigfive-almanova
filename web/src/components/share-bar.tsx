'use client';

import { Button, Tooltip } from '@nextui-org/react';
import { CopyIcon, PDFIcon } from './icons';
import { Report } from '@/actions/index';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface ShareBarProps {
  report: Report;
}

export default function ShareBar({ report }: ShareBarProps) {
  const [_, copy] = useCopyToClipboard();

  const handleCopy = () => async () => {
    if (typeof window !== 'undefined') {
      await copy(window.location.href);
    }
  };

  return (
    <>
      <Tooltip color='secondary' content='Download PDF'>
        <Button
          isIconOnly
          aria-label='Download pdf'
          radius='full'
          size='md'
          variant='light'
          onPress={() => window.print()}
        >
          <PDFIcon size={32} />
        </Button>
      </Tooltip>
      <Tooltip color='secondary' content='Copy link'>
        <Button
          isIconOnly
          aria-label='Copy link'
          radius='full'
          size='md'
          variant='light'
          onPress={handleCopy()}
        >
          <CopyIcon size={42} />
        </Button>
      </Tooltip>
    </>
  );
}
