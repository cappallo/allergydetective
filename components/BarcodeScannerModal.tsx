import React, { useEffect, useState } from 'react';
import XIcon from './icons/XIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import { getProductByBarcode } from '../services/openFoodFactsService';

// Add declaration for Html5Qrcode from CDN
declare var Html5Qrcode: any;

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: { name: string, ingredients: string }) => void;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'loading' | 'error' | 'permission'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setStatus('scanning');
    const qrCodeRegionId = "reader";
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);

    const startScanner = async () => {
      try {
        await Html5Qrcode.getCameras();
        html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 }
          },
          async (decodedText: string) => {
            html5QrCode.pause();
            setStatus('loading');
            const product = await getProductByBarcode(decodedText);
            if (product) {
              onScanSuccess(product);
              onClose();
            } else {
              setErrorMessage("Product not found. Please try another or enter ingredients manually.");
              setStatus('error');
            }
          },
          (errorMessage: string) => {
            // parse error, ignore.
          }
        ).catch((err: Error) => {
             console.error("Camera start error:", err);
             setErrorMessage("Could not start camera. Please ensure permissions are granted and no other app is using it.");
             setStatus('permission');
        });
      } catch (err) {
        console.error("Camera permission error:", err);
        setErrorMessage("Camera permission denied. Please grant permission in your browser settings to use the scanner.");
        setStatus('permission');
      }
    };

    startScanner();

    return () => {
      html5QrCode.stop().catch((err: Error) => {
        // Scanner might already be stopped
      });
    };
  }, [isOpen, onScanSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 text-slate-500 hover:text-slate-800" aria-label="Close scanner">
          <XIcon className="h-6 w-6" />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold text-center mb-4">Scan Product Barcode</h2>
          <div id="reader" className="w-full rounded-md overflow-hidden border border-slate-300"></div>
          
          {status === 'loading' && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center">
              <SpinnerIcon className="h-10 w-10 text-indigo-600 animate-spin" />
              <p className="mt-4 text-slate-600 font-semibold">Fetching Product Info...</p>
            </div>
          )}

          {(status === 'error' || status === 'permission') && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md text-center">
                <p className="font-semibold">Scan Failed</p>
                <p className="text-sm">{errorMessage}</p>
                 <button onClick={onClose} className="mt-2 px-4 py-1 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700">
                    Close
                </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
      `}</style>
    </div>
  );
};

export default BarcodeScannerModal;
