'use client';
import { signInUser } from '@/middleware/auth';

export default function TmpLogin() {
  return (
    <button
      className="absolute z-30"
      onClick={() => {
        console.log('clicked');
        signInUser('oscar.gaske.cs@gmail.com', 'testaccount').then((res) =>
          console.log(res)
        );
      }}
    >
      clickme
    </button>
  );
}
