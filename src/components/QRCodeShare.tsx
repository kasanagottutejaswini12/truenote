import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Props {
  url: string;
}

const QRCodeShare: React.FC<Props> = ({ url }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      const link = document.createElement('a');
      link.download = 'message-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={qrRef} className="bg-card p-5 rounded-2xl border border-border/50 shadow-soft">
        <QRCodeSVG value={url} size={160} bgColor="transparent" fgColor="currentColor" />
      </div>
      <Button variant="outline" size="sm" className="rounded-full font-body text-xs gap-1.5" onClick={downloadQR}>
        <Download className="w-3.5 h-3.5" /> Download QR
      </Button>
    </div>
  );
};

export default QRCodeShare;
