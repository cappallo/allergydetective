import React from 'react';

const BarcodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor"
    {...props}
  >
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M3.75 4.5A.75.75 0 0 1 4.5 3.75h15a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75v-15Zm.75 0v.75h.75V4.5h-.75Zm1.5 0v15h.75v-15h-.75Zm1.5 0v.75h.75V4.5h-.75Zm1.5 0v15h.75v-15h-.75Zm1.5 0v15h.75v-15h-.75Zm1.5 0v.75h.75V4.5h-.75Zm1.5 0v15h.75v-15h-.75Zm1.5 0v.75h.75V4.5h-.75Zm1.5 0v15h.75v-15h-.75Zm1.5 0v.75h.75V4.5h-.75Z" 
    />
  </svg>
);

export default BarcodeIcon;
