import React from 'react';

export const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9 9 9 0 019-9m9 9a9 9 0 01-9 9m9-9H3m16.5 0a9 9 0 01-5.026 8.077 9 9 0 01-1.393 0A9 9 0 013.43 14.5m14.14 0a9 9 0 00-1.48-5.43m-1.48 5.43a9 9 0 01-5.026-8.077 9 9 0 011.393 0A9 9 0 0117.57 9.5" />
    </svg>
);