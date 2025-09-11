// src/app/admin/settings/page.tsx
import SiteSettingsForm, { type InitialSiteSettings } from './SiteSettingsForm';
import { getSiteSettings, getTimeSlotsAction } from './actions';
import TimeSlotManager from './TimeSlotManager';

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
  const timeSlots = await getTimeSlotsAction();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Site Settings</h1>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <SiteSettingsForm initialData={initialData} />
        <TimeSlotManager initialTimeSlots={timeSlots} />
      </div>
    </div>
  );
}