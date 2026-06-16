import "./globals.css";

export const metadata = {
  title: "Wing - Never Go Blank",
  description: "The open-source Ai wingman for your smart glasses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="navbar-wrapper">
          <nav className="circular-navbar">
            <a href="/" className="nav-brand">Wing</a>
          </nav>
        </div>
        
        {children}
      </body>
    </html>
  );
}
