function ScrollViewStyleReset() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: "#root,body,html{height:100%}body{overflow:hidden}#root{display:flex}",
      }}
      id="expo-reset"
    />
  );
}

export default function Html({ children }) {
  const faviconSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="brand" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#0E2235" />
          <stop offset="100%" stop-color="#2A6F97" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#brand)" />
      <circle cx="20" cy="20" r="10" fill="rgba(255,255,255,0.14)" />
      <path d="M38 18L29 30l6.8 9.2-3.9 2.9C27.9 36.6 21 27 21 27L8 46h48L38 18z" fill="#FAFCFE" />
      <circle cx="49" cy="44" r="3.8" fill="#86CFE0" />
    </svg>`
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
          name="viewport"
        />
        <link href={`data:image/svg+xml,${faviconSvg}`} rel="icon" />
        <link href={`data:image/svg+xml,${faviconSvg}`} rel="shortcut icon" />
        <meta content="#0E2235" name="theme-color" />
        <meta content="light" name="color-scheme" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
