// src/app/admin/settings/page.tsx
import SiteSettingsForm, { type InitialSiteSettings } from './SiteSettingsForm';
import { getSiteSettings } from './actions';

async function getInitialDataForForm(): Promise<InitialSiteSettings> {
  const settings = await getSiteSettings();
  return {
    adminContactEmail: settings.adminContactEmail,
    studentsHelpedCount: settings.studentsHelpedCount,
    successRateCLB7: settings.successRateCLB7,
  };
}

export default async function AdminSettingsPage() {
  const initialData = await getInitialDataForForm();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Site Settings</h1>
      <SiteSettingsForm initialData={initialData} />
    </div>
  );
}
