import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StudentView({ data }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">My Performance</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-30">
        <Card>
          <CardHeader>
            <CardTitle>Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>{data. totalAssignments}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Marks</CardTitle>
          </CardHeader>
          <CardContent>{data.averageMarks}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Marks</CardTitle>
          </CardHeader>
          <CardContent>{data.highest}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lowest Marks</CardTitle>
          </CardHeader>
          <CardContent>{data.lowest}</CardContent>
        </Card>
      </div>
    </div>
  );
}
