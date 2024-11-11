/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Response } from "@/server/db/schema";
import { CardContent, Card, CardTitle, CardHeader } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type CustomInstance as TextAreaInstance } from "@/components/fields/TextArea";

interface TextResponseTableProps {
  question: TextAreaInstance;
  responses: Response[];
}
export default function TextResponseTable({
  question,
  responses,
}: TextResponseTableProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{question.properties.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created At</TableHead>
              <TableHead>Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response, index) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">
                  {new Date(response.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Officiis rem veniam iure amet doloremque eius recusandae
                  placeat facilis quis laborum pariatur mollitia rerum
                  cupiditate, accusantium excepturi praesentium. Ipsa, dicta
                  nobis.
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
