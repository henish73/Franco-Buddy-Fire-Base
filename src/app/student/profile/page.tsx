import ProfileForm from './ProfileForm';
import { UserCog } from 'lucide-react';
import Image from 'next/image';

export default function StudentProfilePage() {
  return (
    <div className="space-y-8">
       {/* Hero Section */}
      <section className="relative h-64 rounded-2xl overflow-hidden flex items-center justify-center text-center">
        <Image 
          src="https://picsum.photos/1200/300?random=13"
          alt="Student profile settings"
          fill
          className="object-cover"
          data-ai-hint="profile settings abstract"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-white flex flex-col items-center">
          <UserCog className="h-16 w-16 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
           <p className="text-md md:text-lg mt-2">Manage your personal information and account settings.</p>
        </div>
      </section>
      <div className='max-w-2xl mx-auto'>
        <ProfileForm />
      </div>
    </div>
  );
}
