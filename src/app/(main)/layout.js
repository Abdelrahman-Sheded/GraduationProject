import "@/app/globals.scss";
export const metadata = {
  title: "Home - ResumeGPT",
  description: "AI-powered resume screening assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
