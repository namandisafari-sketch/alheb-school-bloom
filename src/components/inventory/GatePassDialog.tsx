
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, ShieldCheck, Download, PackageCheck } from "lucide-react";
import { format } from "date-fns";

interface GatePassDialogProps {
  transaction: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GatePassDialog({ transaction, open, onOpenChange }: GatePassDialogProps) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md print:shadow-none print:border-none">
        <DialogHeader className="print:hidden">
          <DialogTitle>Gate Pass Issued</DialogTitle>
          <DialogDescription>This receipt must be presented at the gate for confirmation.</DialogDescription>
        </DialogHeader>

        <div id="gate-pass-content" className="p-6 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 space-y-6 relative overflow-hidden">
          {/* Watermark */}
          <ShieldCheck className="absolute -right-8 -bottom-8 h-48 w-48 text-primary/5 -rotate-12" />
          
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-wider text-primary">Gate Pass / Receipt</h2>
            <p className="text-xs text-muted-foreground font-medium">{transaction.tracking_number}</p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-primary/10 pb-2">
              <span className="text-muted-foreground">Item Dispatched:</span>
              <span className="font-bold">{transaction.item?.name}</span>
            </div>
            <div className="flex justify-between border-b border-primary/10 pb-2">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-bold text-lg">{transaction.quantity} {transaction.item?.unit || 'pcs'}</span>
            </div>
            <div className="flex justify-between border-b border-primary/10 pb-2">
              <span className="text-muted-foreground">Recipient:</span>
              <span className="font-bold">{transaction.learner?.full_name || transaction.staff?.full_name || 'General Office'}</span>
            </div>
            <div className="flex justify-between border-b border-primary/10 pb-2">
              <span className="text-muted-foreground">Approval Date:</span>
              <span className="font-medium">{transaction.approval_date ? format(new Date(transaction.approval_date), "dd MMM yyyy, HH:mm") : 'N/A'}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-4 space-y-2">
             <div className="h-16 w-16 bg-white border flex items-center justify-center rounded">
                <PackageCheck className="h-10 w-10 text-primary/40" />
             </div>
             <p className="text-[10px] text-muted-foreground font-mono uppercase">Verified by Admin</p>
          </div>

          <div className="pt-6 text-center">
            <p className="text-[9px] text-muted-foreground uppercase leading-tight italic">
              "This item has been officially cleared for removal from school premises. 
              Security check required at point of exit."
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-4 print:hidden">
          <Button className="flex-1" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print Pass
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
