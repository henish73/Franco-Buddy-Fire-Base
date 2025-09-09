// src/components/icons/Logo.tsx
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';


// This component will render the logo from the provided SVG data.
export function Logo(props: SVGProps<SVGSVGElement>) {
  // Using an img tag with a data URI for the SVG to preserve its original appearance.
  // This avoids potential rendering issues with inline SVGs and CSS.
  const logoBase64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOC4zLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDAgNTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO30NCgkuc3Qxe2ZpbGw6IzAwNTVBNDt9DQoJLnN0MntmaWxsOiNFRjQxMzU7fQ0KPC9zdHlsZT4NCjxnPg0KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMCwwIDAsNTAwIDUwMCw1MDAgNTAwLDAgCSIvPg0KPC9nPg0KPGc+DQoJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIwLDAgMCw1MDAgMTY2LjcsNTAwIDE2Ni43LDAgCSIvPg0KPC9nPg0KPGc+DQoJPHBvbHlnb24gY2xhc3M9InN0MiIgcG9pbnRzPSIzMzMuMywwIDMzMy4zLDUwMCA1MDAgNTAwIDUwMCwwIAkiLz4NCjwvZz4NCjwvc3ZnPg0K";
  return (
    <Image 
      src={logoBase64} 
      alt="FrancoBuddy Logo" 
      width={40} 
      height={40} 
      {...props as any} 
      className={cn("h-8 w-8", props.className)}
    />
  );
}
