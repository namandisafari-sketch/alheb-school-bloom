
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, FileText, Truck } from "lucide-react";

export const ProcurementTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-primary uppercase tracking-widest">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black">5</p>
            <p className="text-xs text-muted-foreground mt-1">Orders in transit or pending delivery</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-success uppercase tracking-widest">Fulfilled This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black">18</p>
            <p className="text-xs text-muted-foreground mt-1">Successfully delivered and verified</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" /> Procurement Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Item(s)</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs">PO-2026-042</TableCell>
                <TableCell className="font-medium">40x Learner's Books, 10x Pencils</TableCell>
                <TableCell>Uganda Bookshop Ltd</TableCell>
                <TableCell><Badge variant="secondary">In Transit</Badge></TableCell>
                <TableCell className="font-bold">UGX 850,000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
