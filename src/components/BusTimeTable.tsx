
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock } from "lucide-react";

const BusTimeTable = () => {
  const timeTableData = [
    { fromBIT: "05:40 AM", doranda: "06:50 AM", stXavier: "07:00 AM", lalpur: "07:05 AM" },
    { fromBIT: "06:30 AM", doranda: "08:00 AM", stXavier: "(Direct to Kantatoli to BIT Mesra)", lalpur: "08:15 AM" },
    { fromBIT: "07:00 AM", doranda: "-", stXavier: "08:10 AM", lalpur: "08:15 AM" },
    { fromBIT: "09:10 AM", doranda: "-", stXavier: "01:00 PM", lalpur: "01:05 PM" },
    { fromBIT: "05:40 PM", doranda: "-", stXavier: "07:30 PM", lalpur: "07:35 PM" },
    { fromBIT: "05:00 PM", doranda: "-", stXavier: "07:45 PM", lalpur: "07:50 AM" }
  ];

  return (
    <Card className="border-primary/10 bg-card/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Bus Timetable
        </CardTitle>
        <CardDescription>Daily bus schedule from BIT Mesra</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">From B.I.T. Mesra</TableHead>
                <TableHead className="font-semibold">Doranda</TableHead>
                <TableHead className="font-semibold">St. Xavier's College (F/C)</TableHead>
                <TableHead className="font-semibold">Lalpur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeTableData.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{row.fromBIT}</TableCell>
                  <TableCell>{row.doranda}</TableCell>
                  <TableCell>{row.stXavier}</TableCell>
                  <TableCell>{row.lalpur}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>* Times are subject to change based on traffic and weather conditions</p>
          <p>* "-" indicates no service at that time</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusTimeTable;
