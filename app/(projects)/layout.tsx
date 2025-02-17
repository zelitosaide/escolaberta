export default function ProjectsLayout({ 
  children 
}: { 
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}