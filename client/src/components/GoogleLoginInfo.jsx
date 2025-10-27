import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const GoogleLoginInfo = () => {
  const [showInfo, setShowInfo] = useState(true);

  if (!showInfo) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg relative">
      <button
        onClick={() => setShowInfo(false)}
        className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-2 pr-6">
        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">Google Sign-In Help</p>
          <p className="mt-1">
            If you see FedCM errors, try clicking the site settings icon (🔒) in your address bar 
            and allow third-party sign-in, or use the "Alternative Google Sign-In" button.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleLoginInfo;