import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Link, FileText, Mail, Phone, MessageSquare, Download, Copy, RefreshCw, Heart } from 'lucide-react';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'sms';

function App() {
  const [qrType, setQrType] = useState<QRType>('url');
  const [input, setInput] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateQRCode = async (value: string) => {
    try {
      setIsLoading(true);
      const url = await QRCode.toDataURL(value, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeData(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (input) {
      generateQRCode(input);
    }
  }, [input]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCodeData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
  };

  const getPlaceholder = () => {
    switch (qrType) {
      case 'url':
        return 'Enter URL (e.g., https://example.com)';
      case 'text':
        return 'Enter text message';
      case 'email':
        return 'Enter email address';
      case 'phone':
        return 'Enter phone number';
      case 'sms':
        return 'Enter phone number for SMS';
      default:
        return 'Enter value';
    }
  };

  const qrTypes = [
    { type: 'url' as QRType, icon: Link, label: 'URL' },
    { type: 'text' as QRType, icon: FileText, label: 'Text' },
    { type: 'email' as QRType, icon: Mail, label: 'Email' },
    { type: 'phone' as QRType, icon: Phone, label: 'Phone' },
    { type: 'sms' as QRType, icon: MessageSquare, label: 'SMS' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            WeLoveQr<Heart className="text-red-500 fill-current" size={32} />
          </h1>
          <p className="text-gray-600">Create beautiful QR codes instantly</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {qrTypes.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setQrType(type)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      qrType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {qrType.charAt(0).toUpperCase() + qrType.slice(1)} Content
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
                    title="Copy to clipboard"
                  >
                    <Copy size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
              {isLoading ? (
                <div className="animate-spin">
                  <RefreshCw size={32} className="text-blue-600" />
                </div>
              ) : qrCodeData ? (
                <>
                  <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
                  <button
                    onClick={handleDownload}
                    className="mt-4 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={18} />
                    Download QR Code
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <QrCode size={64} />
                  <p className="mt-2">Enter content to generate QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;