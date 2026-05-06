
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function InventorySummaryWidget() {
  const { data: stats } = useQuery({
    queryKey: ["admin-inventory-stats"],
    queryFn: async () => {
      const { data: items } = await supabase.from("inventory_items").select(`
        *,
        stock:inventory_stock(quantity)
      `);
      
      if (!items) return null;

      const lowStock = items.filter(i => (i.stock?.[0]?.quantity || 0) <= i.min_stock_level).length;
      const totalValue = 0; // Logic for value could be added if price is tracked
      const totalItems = items.length;

      return { lowStock, totalItems };
    }
  });

  return (
    <Card className="border-2 border-slate-100 shadow-sm overflow-hidden group hover:border-orange-200 transition-all">
      <CardHeader className="bg-slate-50/50 pb-2">
        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <Package className="h-4 w-4 text-orange-500" />
          School Stores
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
           <div>
             <p className="text-2xl font-black text-slate-900">{stats?.totalItems || 0}</p>
             <p className="text-[10px] font-bold text-slate-500 uppercase">Tracked SKUs</p>
           </div>
           <div className="text-right">
             <Badge className={stats?.lowStock ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-emerald-100 text-emerald-700"}>
               {stats?.lowStock || 0} Low Stock
             </Badge>
           </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
             <span className="text-slate-400">Inventory Health</span>
             <span className="text-slate-900">{stats ? Math.round(((stats.totalItems - stats.lowStock) / stats.totalItems) * 100) : 0}%</span>
          </div>
          <Progress value={stats ? ((stats.totalItems - stats.lowStock) / stats.totalItems) * 100 : 0} className="h-1.5 bg-slate-100" />
        </div>

        <div className="pt-2 grid grid-cols-2 gap-2">
           <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              <span className="text-[9px] font-bold uppercase text-slate-600">Reorder Alert</span>
           </div>
           <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-[9px] font-bold uppercase text-slate-600">Assets Secured</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
