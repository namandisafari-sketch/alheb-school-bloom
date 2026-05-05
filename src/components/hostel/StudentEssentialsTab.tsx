
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, AlertCircle, XCircle } from "lucide-react";

export const StudentEssentialsTab = () => {
  const essentials = [
    { learner: "Umar Mukhtar", class: "P3", items: { net: "Present", boots: "Missing", buckets: "Present" } },
    { learner: "Zainab Ali", class: "P1", items: { net: "Present", boots: "Present", buckets: "Damaged" } },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search learner for essentials check..." className="pl-10" />
      </div>

      <div className="grid gap-4">
        {essentials.map((student) => (
          <Card key={student.learner} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                <div>
                  <h4 className="font-bold text-lg">{student.learner}</h4>
                  <Badge variant="outline">{student.class}</Badge>
                </div>
                <div className="flex gap-4">
                  {Object.entries(student.items).map(([item, status]) => (
                    <div key={item} className="text-center">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{item}</p>
                      <div className="flex items-center gap-1">
                        {status === 'Present' ? <Check className="h-4 w-4 text-success" /> : 
                         status === 'Missing' ? <XCircle className="h-4 w-4 text-destructive" /> : 
                         <AlertCircle className="h-4 w-4 text-amber-500" />}
                        <span className={`text-xs font-bold ${
                          status === 'Present' ? 'text-success' : 
                          status === 'Missing' ? 'text-destructive' : 'text-amber-600'
                        }`}>{status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
