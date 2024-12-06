export async function generateMetadata({
  params,
}: {
  params: Promise<{ notepad: string }>;
}) {
  const { notepad } = await params;

  return {
    title: `Notepad | ${notepad}`,
  };
}

export default function NotepadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
