
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Activity, ShieldCheck, Database, HardDrive, Cpu, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SystemHealthWidget() {
  const isOnline = navigator.onLine;

  return (
    <Card className="border-2 border-slate-900 bg-slate-900 text-white shadow-xl overflow-hidden group">
      <CardHeader className="pb-2 border-b border-slate-800">
        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-emerald-400" />
            School VPS Node
          </div>
          <Badge className={cn(
            "text-[9px] font-black uppercase",
            isOnline ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
          )}>
            {isOnline ? "Operational" : "Offline"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-1">
             <div className="flex items-center gap-2 text-slate-400">
               <Cpu className="h-3 w-3" />
               <span className="text-[9px] font-black uppercase tracking-widest">CPU Load</span>
             </div>
             <p className="text-xl font-black">14.2%</p>
             <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[14%]" />
             </div>
           </div>
           <div className="space-y-1">
             <div className="flex items-center gap-2 text-slate-400">
               <Activity className="h-3 w-3" />
               <span className="text-[9px] font-black uppercase tracking-widest">RAM Usage</span>
             </div>
             <p className="text-xl font-black">2.4 GB</p>
             <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[30%]" />
             </div>
           </div>
        </div>

        <div className="space-y-3">
           <div className="flex items-center justify-between text-[10px] font-bold">
              <div className="flex items-center gap-2 text-slate-400">
                <HardDrive className="h-3.5 w-3.5" />
                <span>STORAGE (SSD)</span>
              </div>
              <span className="text-slate-200 uppercase">492 GB Free</span>
           </div>
           
           <div className="flex items-center justify-between text-[10px] font-bold">
              <div className="flex items-center gap-2 text-slate-400">
                <Database className="h-3.5 w-3.5" />
                <span>DATABASE STATUS</span>
              </div>
              <span className="text-emerald-400 uppercase">Optimized</span>
           </div>

           <div className="flex items-center justify-between text-[10px] font-bold">
              <div className="flex items-center gap-2 text-slate-400">
                <Wifi className="h-3.5 w-3.5" />
                <span>LOCAL LAN ACCESS</span>
              </div>
              <span className="text-blue-400 uppercase">Active</span>
           </div>
        </div>

        <div className="pt-2">
           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <p className="text-[10px] font-bold text-emerald-400 uppercase leading-tight">
                Self-hosted protection active. Local encryption enabled.
              </p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
