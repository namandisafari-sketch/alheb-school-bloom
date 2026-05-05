
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bed, Wind, PackageCheck, ClipboardList } from "lucide-react";
import { HostelLogisticsTab } from "@/components/hostel/HostelLogisticsTab";
import { WashingMachineTab } from "@/components/hostel/WashingMachineTab";
import { StudentEssentialsTab } from "@/components/hostel/StudentEssentialsTab";

const Hostel = () => {
  return (
    <DashboardLayout title="Hostel & Welfare" subtitle="Track hostel logistics, washing machine usage, and student essentials">
      <Tabs defaultValue="logistics" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="logistics" className="gap-2">
            <ClipboardList className="h-4 w-4" /> Logistics & Supplies
          </TabsTrigger>
          <TabsTrigger value="washing" className="gap-2">
            <Wind className="h-4 w-4" /> Washing Machine
          </TabsTrigger>
          <TabsTrigger value="essentials" className="gap-2">
            <PackageCheck className="h-4 w-4" /> Student Essentials
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="logistics" className="mt-4">
          <HostelLogisticsTab />
        </TabsContent>
        <TabsContent value="washing" className="mt-4">
          <WashingMachineTab />
        </TabsContent>
        <TabsContent value="essentials" className="mt-4">
          <StudentEssentialsTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Hostel;
