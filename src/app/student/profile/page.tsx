import ProfileForm from './ProfileForm';
import { UserCog } from 'lucide-react';

export default function StudentProfilePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <UserCog className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">My Profile</h1>
      </div>
      <p className="text-muted-foreground">Manage your personal information and account settings.</p>
      <ProfileForm />
    </div>
  );
}
