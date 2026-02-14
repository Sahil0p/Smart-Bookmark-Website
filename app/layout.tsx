import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-gradient-to-br
        from-slate-100 to-slate-200
        dark:from-slate-900 dark:to-slate-950
        transition-colors
        "
      >
        {/* 🔒 Prevent any child from causing horizontal overflow */}
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>

        {/* 🔔 Global Toast Notifications */}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              backdropFilter: "blur(12px)",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
