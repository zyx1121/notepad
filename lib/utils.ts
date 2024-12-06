export function generateNotepadId(length: number = 6): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz';

  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(array[i] % characters.length);
  }

  return result;
}
