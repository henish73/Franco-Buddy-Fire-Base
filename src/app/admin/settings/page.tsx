import SiteSettingsForm, { type InitialSiteSettings } from './SiteSettingsForm';

// Simulate fetching initial data from Firestore
async function getInitialSiteSettings(): Promise<InitialSiteSettings> {
  // In a real app, fetch this from Firestore:
  // const doc = await db.collection('site_settings_basic').doc('homepage_stats').get();
  // if (doc.exists) return doc.data() as InitialSiteSettings;
  return {
    adminContactEmail: "admin@frenchgta.ca", // Placeholder
    studentsHelpedCount: 150, // Placeholder
    successRateCLB7: 92, // Placeholder
  };
}

export default async function AdminSettingsPage() {
  const initialData = await getInitialSiteSettings();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Site Settings</h1>
      <SiteSettingsForm initialData={initialData} />
    </div>
  );
}
