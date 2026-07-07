import PropTypes from 'prop-types';

// third-party
import 'simplebar-react/dist/simplebar.min.css';

// fonts
import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

// project-imports
import ProviderWrapper from './ProviderWrapper';

export const metadata = {
  title: 'KI-Projektplaner – Perspektivgeber',
  description:
    'Interne Anwendung von Perspektivgeber: identifiziert, qualifiziert und priorisiert KI-Use-Cases aus Kunden-Kontextprofilen und Termin-Transkripten und stellt sie als Umsetzungs-Roadmap dar.',
  author: 'Perspektivgeber'
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="stylesheet" href="/third-party/react-table.css" />
      </head>
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}

RootLayout.propTypes = { children: PropTypes.node };
