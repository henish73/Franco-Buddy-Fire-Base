// src/app/admin/site-management/settings/page.tsx
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
      <h2 className="text-2xl font-bold text-foreground">General Site Settings</h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <SiteSettingsForm initialData={initialData} />
        <TimeSlotManager initialTimeSlots={timeSlots} />
      </div>
    </div>
  );
}
