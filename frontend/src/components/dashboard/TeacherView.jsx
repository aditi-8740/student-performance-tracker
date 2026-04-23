import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function TeacherView({ data }) {
  return (

    <>

      <h1 className="text-2xl font-semibold">Class Analytics</h1>

      {/* Class Average */}
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Class Average</CardTitle>
        </CardHeader>
        <CardContent className="text-xl">
          {data.classAverage}
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Students ({data.students.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">
                  Average Marks
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.students.map((s) => (
                <TableRow key={s.studentId}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell className="text-right">
                    {s.average}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </>
  );
}
