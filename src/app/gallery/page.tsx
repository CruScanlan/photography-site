import { redirect } from 'next/navigation';

export default function GalleryRedirect() {
  redirect('/gallery/personal-favourites');
}

