
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wallet, Clock, CheckCircle2, XCircle } from "lucide-react";

export const BudgetRequestsTab = () => {
  const requests = [
    { id: "REQ-001", title: "New Desks for P4", amount: "1,200,000", dept: "Academic", status: "Pending" },
    { id: "REQ-002", title: "Detergent Supply (Bulk)", amount: "450,000", dept: "Hostel", status: "Approved" },
    { id: "REQ-003", title: "Solar Light Maintenance", amount: "800,000", dept: "Facilities", status: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" /> Active Requests
        </h3>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Create Request
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {requests.map((req) => (
          <Card key={req.id} className="border-none shadow-md overflow-hidden group">
            <div className={`h-1 w-full ${
              req.status === 'Approved' ? 'bg-success' : 
              req.status === 'Pending' ? 'bg-amber-400' : 'bg-destructive'
            }`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="font-mono text-[10px]">{req.id}</Badge>
                {req.status === 'Approved' ? <CheckCircle2 className="h-4 w-4 text-success" /> : 
                 req.status === 'Pending' ? <Clock className="h-4 w-4 text-amber-500" /> : 
                 <XCircle className="h-4 w-4 text-destructive" />}
              </div>
              <CardTitle className="text-base font-bold mt-2">{req.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{req.dept} Department</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-black text-primary">UGX {req.amount}</p>
              <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="outline" className="flex-1 text-xs">View Details</Button>
                {req.status === 'Pending' && (
                  <Button size="sm" className="flex-1 text-xs bg-success hover:bg-success/90">Approve</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
