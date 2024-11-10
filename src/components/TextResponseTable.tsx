/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Response } from "@/server/db/schema";
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
    <div className="w-full">
      <h2 className="mb-4 text-xl">{question.properties.label}</h2>
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
              <TableCell>
                {new Date(response.createdAt).toDateString()}
              </TableCell>
              <TableCell>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Officiis rem veniam iure amet doloremque eius recusandae placeat
                facilis quis laborum pariatur mollitia rerum cupiditate,
                accusantium excepturi praesentium. Ipsa, dicta nobis.
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
