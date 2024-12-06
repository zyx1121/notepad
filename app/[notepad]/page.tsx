'use client';

import { db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { use, useEffect, useState } from 'react';

export default function Notepad({ params }: { params: Promise<{ notepad: string }> }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { notepad: notepadId } = use(params);

  useEffect(() => {
    const loadNotepad = async () => {
      try {
        const noteRef = doc(db, 'notepads', notepadId);
        const noteSnap = await getDoc(noteRef);

        if (noteSnap.exists()) {
          setContent(noteSnap.data().content);
        } else {
          try {
            await setDoc(noteRef, {
              content: '',
              createdAt: new Date(),
            });
          } catch (error) {
            console.error('Create notepad error:', error);
          }
        }
      } catch (error) {
        console.error('Read notepad error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotepad();

    const unsubscribe = onSnapshot(
      doc(db, 'notepads', notepadId),
      (doc) => {
        if (doc.exists()) {
          setContent(doc.data().content);
        }
      },
      (error) => {
        console.error('Listen notepad error:', error);
      }
    );

    return () => unsubscribe();
  }, [notepadId]);

  const handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    try {
      const notepadRef = doc(db, 'notepads', notepadId);
      await setDoc(notepadRef, { content: newContent }, { merge: true });
    } catch (error) {
      console.error('Update content error:', error);
    }
  };

  if (loading) return null;

  return (
    <main className="h-dvh w-dvw p-4">
      <textarea
        className="w-full h-full p-4 bg-transparent border rounded-lg resize-none focus:outline-none"
        value={content}
        onChange={handleContentChange}
        placeholder="Typing..."
      />
    </main>
  );
}
