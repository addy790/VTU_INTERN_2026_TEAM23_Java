import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { companyHiring } from "@/lib/mock-data";

const AdminCompanies = () => {
  return (
    <DashboardLayout title="Registered Companies">
      <div className="surface-card p-6">
        <div className="font-display text-lg mb-6">Partner Companies</div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {companyHiring.map((c) => (
            <div key={c.company} className="p-4 rounded-lg border border-border bg-secondary/30 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-maroon grid place-items-center text-xl font-bold text-white shadow-glow">
                {c.company[0]}
              </div>
              <div>
                <div className="font-medium">{c.company}</div>
                <div className="text-xs text-muted-foreground">{c.hires} Hires this season</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCompanies;
