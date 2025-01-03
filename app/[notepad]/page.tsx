"use client";

import { db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { use, useEffect, useState } from "react";

const placeholder = `# Welcome to Notepad! ✨

A simple, real-time collaborative notepad:
• Auto-saves as you type
• Real-time sync across devices
• Share URL to collaborate
• No login required

Start typing...
`;

export default function Notepad({
  params,
}: {
  params: Promise<{ notepad: string }>;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { notepad: notepadId } = use(params);

  useEffect(() => {
    const loadNotepad = async () => {
      try {
        const noteRef = doc(db, "notepads", notepadId);
        const noteSnap = await getDoc(noteRef);

        if (noteSnap.exists()) {
          setContent(noteSnap.data().content);
        } else {
          try {
            await setDoc(noteRef, {
              content: "",
              createdAt: new Date(),
            });
          } catch (error) {
            console.error("Create notepad error:", error);
          }
        }
      } catch (error) {
        console.error("Read notepad error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotepad();

    const unsubscribe = onSnapshot(
      doc(db, "notepads", notepadId),
      (doc) => {
        if (doc.exists()) {
          setContent(doc.data().content);
        }
      },
      (error) => {
        console.error("Listen notepad error:", error);
      },
    );

    return () => unsubscribe();
  }, [notepadId]);

  const handleContentChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newContent = e.target.value;
    setContent(newContent);

    try {
      const notepadRef = doc(db, "notepads", notepadId);
      await setDoc(notepadRef, { content: newContent }, { merge: true });
    } catch (error) {
      console.error("Update content error:", error);
    }
  };

  if (loading) return null;

  return (
    <main className="h-dvh w-dvw p-4">
      <textarea
        className="h-full w-full resize-none rounded-lg bg-transparent p-4 focus:outline-none"
        value={content}
        onChange={handleContentChange}
        placeholder={placeholder}
      />
    </main>
  );
}
