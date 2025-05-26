import SiteSettingsForm, { type InitialSiteSettings } from './SiteSettingsForm';
import { getSiteSettings } from './actions'; // Import the new function

// Simulate fetching initial data from Firestore
async function getInitialDataForForm(): Promise<InitialSiteSettings> {
  // In a real app, fetch this from Firestore (e.g., the same getSiteSettings could be adapted or another function used)
  // const doc = await db.collection('site_configuration').doc('generalSiteInfo').get();
  // if (doc.exists) {
  //   const data = doc.data();
  //   return {
  //     adminContactEmail: data.adminContactEmail || "admin@frenchgta.ca",
  //     studentsHelpedCount: data.studentsHelpedCount || 150,
  //     successRateCLB7: data.successRateCLB7 || 92,
  //   };
  // }
  
  // For the form, we fetch the raw values. The getSiteSettings used by the homepage formats them.
  // This simulation will just return defaults if no data is "saved" by the admin yet.
  // To make this truly live, the getSiteSettings would fetch from Firestore.
  const settings = await getSiteSettings(); // This will run our simulated fetch
  
  return {
    adminContactEmail: settings?.adminContactEmail || "admin@frenchgta.ca", // Placeholder
    studentsHelpedCount: parseInt(settings?.studentsHelpedCount?.replace('+', '') || "150"), // Placeholder, convert back from display format
    successRateCLB7: parseInt(settings?.successRateCLB7?.replace('%', '') || "92"), // Placeholder
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
