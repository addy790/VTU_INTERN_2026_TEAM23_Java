import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { placementTrend, departmentPerf, companyHiring } from "@/lib/mock-data";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";

const AdminAnalytics = () => {
  return (
    <DashboardLayout title="Analytics & Reports">
      <div className="space-y-6">
        <div className="surface-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-display text-lg">Offers over time</div>
              <div className="text-xs text-muted-foreground">Cumulative offers by month for the current season</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={placementTrend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area dataKey="offers" stroke="hsl(var(--primary-glow))" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="surface-card p-6 flex flex-col">
            <div className="font-display text-lg mb-4">Department performance</div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentPerf}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="placed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Placed" />
                  <Bar dataKey="total" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Total Eligible" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="surface-card p-6 flex flex-col">
            <div className="font-display text-lg mb-4">Top hiring companies</div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyHiring} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="company" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={70} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="hires" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} name="Offers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
