import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

function Attendance({ data }) {
  return (
    <Table>
      <TableCaption>Attendance Details</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead className="text-right">Attendance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.date}>
            <TableCell className="font-medium">{item.date}</TableCell>
            <TableCell className="text-right">{item.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Attendance;
