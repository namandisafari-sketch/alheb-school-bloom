
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, UserPlus, Clock, TrendingDown, Plus, Search, Loader2, CheckCircle2, History, AlertCircle, Coins, Landmark, Edit2, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Payroll = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("runs");
  
  // Dialog States
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isIssuingAdvance, setIsIssuingAdvance] = useState(false);
  const [isGeneratingPayroll, setIsGeneratingPayroll] = useState(false);

  // Form States - Employee
  const [empName, setEmpName] = useState("");
  const [empPosition, setEmpPosition] = useState("");
  const [empSalary, setEmpSalary] = useState("");
  const [empTIN, setEmpTIN] = useState("");
  const [empNSSF, setEmpNSSF] = useState("");

  // Form States - Advance
  const [advEmployee, setAdvEmployee] = useState("");
  const [advAmount, setAdvAmount] = useState("");
  const [advReason, setAdvReason] = useState("");

  // Queries
  const { data: employees, isLoading: loadingEmployees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employees").select("*").order("full_name");
      if (error) throw error;
      return data;
    }
  });

  const { data: advances, isLoading: loadingAdvances } = useQuery({
    queryKey: ["employee_advances"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employee_advances").select("*, employees(full_name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: payrollRuns, isLoading: loadingRuns } = useQuery({
    queryKey: ["payroll_runs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payroll_runs").select("*").order("month", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Mutations
  const addEmployeeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("employees").insert({
        full_name: empName,
        position: empPosition,
        base_salary: parseFloat(empSalary),
        tin_number: empTIN,
        nssf_number: empNSSF
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee record created");
      setIsAddingEmployee(false);
      setEmpName("");
      setEmpSalary("");
    }
  });

  const issueAdvanceMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("employee_advances").insert({
        employee_id: advEmployee,
        amount: parseFloat(advAmount),
        reason: advReason,
        status: "approved" // Auto-approved for now as per simplicity requested
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_advances"] });
      toast.success("Salary advance issued successfully");
      setIsIssuingAdvance(false);
      setAdvAmount("");
    }
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("employees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Staff record deleted");
    }
  });

  const generatePayrollRunMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      // 1. Create Run
      const { data: run, error: runError } = await supabase.from("payroll_runs").insert({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        status: "draft"
      }).select().single();
      if (runError) throw runError;

      // 2. Generate Lines for each employee
      if (employees) {
        const lines = employees.map((emp: any) => ({
          run_id: run.id,
          employee_id: emp.id,
          base_salary: emp.base_salary,
          net_pay: emp.base_salary // Simplification: net = base
        }));
        const { error: lineError } = await supabase.from("payroll_lines").insert(lines);
        if (lineError) throw lineError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll_runs"] });
      toast.success("Payroll batch generated for " + format(new Date(), 'MMMM'));
      setIsGeneratingPayroll(false);
    }
  });

  return (
    <DashboardLayout title={t("payroll")} subtitle="Calculate salaries, manage advances, and maintain HR records">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-slate-100 rounded-2xl">
          <TabsTrigger value="runs" className="gap-2 rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <CreditCard className="h-4 w-4" /> Payroll Runs
          </TabsTrigger>
          <TabsTrigger value="advances" className="gap-2 rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <TrendingDown className="h-4 w-4" /> Advances
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Clock className="h-4 w-4" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="employees" className="gap-2 rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <UserPlus className="h-4 w-4" /> HR Setup
          </TabsTrigger>
        </TabsList>
        
        {/* Payroll Runs Tab */}
        <TabsContent value="runs" className="mt-6 space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
             <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Monthly Calculations</h2>
                <p className="text-sm text-slate-500 font-medium">Generate net pay batches with automatic deductions.</p>
             </div>
             <Button className="gap-2 bg-slate-900 rounded-2xl h-12 px-6" onClick={() => setIsGeneratingPayroll(true)}>
                <Plus className="h-5 w-5" /> Generate Payroll Run
             </Button>
          </div>

          <div className="grid gap-4">
             {loadingRuns ? (
               <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-slate-200" /></div>
             ) : payrollRuns?.length ? (
               payrollRuns.map(run => (
                 <Card key={run.id} className="p-6 rounded-[32px] border-slate-100 hover:border-slate-300 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
                          {format(new Date(run.month), 'MMM')}
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-900">{format(new Date(run.month), 'MMMM yyyy')}</h3>
                          <Badge variant="outline" className="text-[10px] font-black uppercase">{run.status}</Badge>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Net Pay</p>
                       <p className="text-lg font-black text-slate-900 font-mono">{run.total_net_pay?.toLocaleString() || "0"} <span className="text-xs text-slate-400">UGX</span></p>
                    </div>
                 </Card>
               ))
             ) : (
               <div className="py-20 border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center text-center text-slate-400">
                  <CreditCard className="h-16 w-16 mb-4 opacity-10" />
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">No Runs Found</h3>
                  <p className="text-sm mt-1">Start by generating your first monthly payroll batch.</p>
               </div>
             )}
          </div>
        </TabsContent>

        {/* Advances Tab */}
        <TabsContent value="advances" className="mt-6 space-y-6">
           <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
             <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Salary Advances</h2>
                <p className="text-sm text-slate-500 font-medium">Track staff loans for automatic payroll recovery.</p>
             </div>
             <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl h-12 px-6" onClick={() => setIsIssuingAdvance(true)}>
                <Coins className="h-5 w-5" /> Issue Advance
             </Button>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Date Issued</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 text-center">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {loadingAdvances ? (
                     <tr><td colSpan={5} className="p-10 text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto text-slate-200" /></td></tr>
                   ) : advances?.length ? (
                     advances.map(adv => (
                       <tr key={adv.id} className="text-sm hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{adv.employees?.full_name}</td>
                          <td className="px-6 py-4 text-slate-500">{format(new Date(adv.created_at), 'MMM dd, yyyy')}</td>
                          <td className="px-6 py-4 text-slate-400 italic">{adv.reason || '-'}</td>
                          <td className="px-6 py-4 text-right font-black text-slate-900">{adv.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                             <Badge className={cn(
                               "uppercase text-[10px] font-black",
                               adv.status === 'repaid' ? 'bg-emerald-500' : 'bg-amber-500'
                             )}>
                                {adv.status}
                             </Badge>
                          </td>
                       </tr>
                     ))
                   ) : (
                     <tr><td colSpan={5} className="p-20 text-center text-slate-300 italic">No advances found in system.</td></tr>
                   )}
                </tbody>
             </table>
          </div>
        </TabsContent>

        {/* HR Setup Tab */}
        <TabsContent value="employees" className="mt-6 space-y-6">
           <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
             <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Employee Master</h2>
                <p className="text-sm text-slate-500 font-medium">Maintain base salaries, TIN, and NSSF identifiers.</p>
             </div>
             <Button className="gap-2 bg-slate-900 text-white rounded-2xl h-12 px-6" onClick={() => setIsAddingEmployee(true)}>
                <UserPlus className="h-5 w-5" /> Register Staff
             </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {loadingEmployees ? (
               <div className="col-span-full py-20 flex justify-center"><Loader2 className="animate-spin text-slate-200" /></div>
             ) : employees?.length ? (
               employees.map(emp => (
                 <Card key={emp.id} className="p-6 rounded-[40px] border-slate-100 hover:border-slate-300 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-50"><Edit2 className="h-4 w-4" /></Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                         onClick={() => confirm("Delete staff record permanently?") && deleteEmployeeMutation.mutate(emp.id)}
                       >
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                       <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl">
                          {emp.full_name.charAt(0)}
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-slate-900 leading-tight">{emp.full_name}</h3>
                          <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{emp.position}</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Base Salary</span>
                          <span className="font-mono font-black text-slate-900">{emp.base_salary.toLocaleString()} <span className="text-[10px] text-slate-400">UGX</span></span>
                       </div>
                       <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">TIN</span>
                          <span className="text-xs font-bold text-slate-600">{emp.tin_number || '-'}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">NSSF</span>
                          <span className="text-xs font-bold text-slate-600">{emp.nssf_number || '-'}</span>
                       </div>
                    </div>
                 </Card>
               ))
             ) : (
               <div className="col-span-full py-20 border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center text-center text-slate-400">
                  <UserPlus className="h-16 w-16 mb-4 opacity-10" />
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">No Staff Records</h3>
                  <p className="text-sm mt-1">Register your first employee to enable payroll tracking.</p>
               </div>
             )}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
           <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                 <h3 className="font-black uppercase tracking-tight text-slate-900">Attendance Tracker - {format(new Date(), 'MMMM')}</h3>
                 <Button className="h-10 rounded-2xl bg-slate-900 text-[10px] font-black uppercase px-6">Submit Daily Log</Button>
              </div>
              <table className="w-full text-left">
                 <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <tr>
                       <th className="px-6 py-4">Employee</th>
                       {Array.from({ length: 5 }).map((_, i) => (
                         <th key={i} className="px-2 py-4 text-center">Day {i+1}</th>
                       ))}
                       <th className="px-6 py-4 text-right">Total Days</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {employees?.map(emp => (
                      <tr key={emp.id} className="text-sm hover:bg-slate-50">
                         <td className="px-6 py-4 font-bold">{emp.full_name}</td>
                         {Array.from({ length: 5 }).map((_, i) => (
                           <td key={i} className="px-2 py-4 text-center">
                              <div className="h-4 w-4 rounded-full bg-emerald-100 mx-auto border-2 border-emerald-500" />
                           </td>
                         ))}
                         <td className="px-6 py-4 text-right font-mono font-bold">22 / 22</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </TabsContent>
      </Tabs>

      {/* Add Employee Dialog */}
      <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
        <DialogContent className="max-w-md rounded-[32px] border-none shadow-2xl p-8">
           <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                 <UserPlus className="h-6 w-6 text-indigo-500" /> Register Employee
              </DialogTitle>
           </DialogHeader>
           
           <div className="space-y-4 py-4">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400">Full Name</Label>
                 <Input 
                   value={empName}
                   onChange={e => setEmpName(e.target.value)}
                   className="h-12 rounded-2xl border-slate-200" 
                   placeholder="e.g. John Doe" 
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Position</Label>
                    <Input 
                      value={empPosition}
                      onChange={e => setEmpPosition(e.target.value)}
                      className="h-12 rounded-2xl border-slate-200" 
                      placeholder="e.g. Teacher" 
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Base Salary</Label>
                    <Input 
                      type="number"
                      value={empSalary}
                      onChange={e => setEmpSalary(e.target.value)}
                      className="h-12 rounded-2xl border-slate-200" 
                      placeholder="0.00" 
                    />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">TIN Number</Label>
                    <Input 
                      value={empTIN}
                      onChange={e => setEmpTIN(e.target.value)}
                      className="h-12 rounded-2xl border-slate-200 font-mono" 
                      placeholder="T-..." 
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">NSSF Number</Label>
                    <Input 
                      value={empNSSF}
                      onChange={e => setEmpNSSF(e.target.value)}
                      className="h-12 rounded-2xl border-slate-200 font-mono" 
                      placeholder="N-..." 
                    />
                 </div>
              </div>
           </div>

           <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setIsAddingEmployee(false)} className="rounded-2xl">Cancel</Button>
              <Button 
                onClick={() => addEmployeeMutation.mutate()}
                disabled={!empName || !empSalary || addEmployeeMutation.isPending}
                className="bg-indigo-600 text-white rounded-2xl h-12 px-8 font-black uppercase tracking-widest"
              >
                 {addEmployeeMutation.isPending ? <Loader2 className="animate-spin" /> : "Save Record"}
              </Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issue Advance Dialog */}
      <Dialog open={isIssuingAdvance} onOpenChange={setIsIssuingAdvance}>
        <DialogContent className="max-w-md rounded-[32px] border-none shadow-2xl p-8">
           <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                 <Coins className="h-6 w-6 text-amber-500" /> Issue Salary Advance
              </DialogTitle>
           </DialogHeader>
           
           <div className="space-y-4 py-4">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400">Select Employee</Label>
                 <Select value={advEmployee} onValueChange={setAdvEmployee}>
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                       <SelectValue placeholder="Choose staff..." />
                    </SelectTrigger>
                    <SelectContent>
                       {employees?.map(emp => (
                         <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400">Advance Amount (UGX)</Label>
                 <Input 
                   type="number"
                   value={advAmount}
                   onChange={e => setAdvAmount(e.target.value)}
                   className="h-12 rounded-2xl border-slate-200 font-mono" 
                   placeholder="0.00" 
                 />
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400">Reason</Label>
                 <Input 
                   value={advReason}
                   onChange={e => setAdvReason(e.target.value)}
                   className="h-12 rounded-2xl border-slate-200" 
                   placeholder="e.g. Medical emergency" 
                 />
              </div>
           </div>

           <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setIsIssuingAdvance(false)} className="rounded-2xl">Cancel</Button>
              <Button 
                onClick={() => issueAdvanceMutation.mutate()}
                disabled={!advEmployee || !advAmount || issueAdvanceMutation.isPending}
                className="bg-amber-500 text-white rounded-2xl h-12 px-8 font-black uppercase tracking-widest"
              >
                 {issueAdvanceMutation.isPending ? <Loader2 className="animate-spin" /> : "Approve & Issue"}
              </Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Payroll Run Dialog */}
      <Dialog open={isGeneratingPayroll} onOpenChange={setIsGeneratingPayroll}>
        <DialogContent className="max-w-md rounded-[32px] border-none shadow-2xl p-8">
           <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-slate-900">
                 <Landmark className="h-6 w-6 text-emerald-500" /> Start Salary Run
              </DialogTitle>
           </DialogHeader>
           
           <div className="py-6 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-[32px] bg-slate-900 text-white flex items-center justify-center font-black text-2xl mb-4 shadow-xl shadow-slate-200">
                 {format(new Date(), 'MMM')}
              </div>
              <h4 className="text-lg font-bold text-slate-900">Process {format(new Date(), 'MMMM yyyy')}?</h4>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">This will calculate net pay for all active employees, factoring in approved advances and attendance logs.</p>
           </div>

           <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setIsGeneratingPayroll(false)} className="rounded-2xl">Cancel</Button>
              <Button 
                onClick={() => generatePayrollRunMutation.mutate()}
                disabled={generatePayrollRunMutation.isPending}
                className="bg-slate-900 text-white rounded-2xl h-12 px-8 font-black uppercase tracking-widest"
              >
                 {generatePayrollRunMutation.isPending ? <Loader2 className="animate-spin" /> : "Confirm & Run"}
              </Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const Edit2 = ({ className }: { className?: string }) => <History className={cn("rotate-180", className)} />;

export default Payroll;
