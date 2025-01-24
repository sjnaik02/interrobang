/* eslint-disable @typescript-eslint/no-unsafe-call */
import { CardContent, Card, CardTitle, CardHeader } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RenderResponse = {
  createdAt: Date;
  text: string;
};

interface TextResponseTableProps {
  questionLabel: string;
  responses: RenderResponse[];
}

export default function TextResponseTable({
  questionLabel,
  responses,
}: TextResponseTableProps) {
  if (responses.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{questionLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Created At</TableHead>
                <TableHead>Response</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>
                  <div className="relative flex h-64 w-full items-center justify-center">
                    <div className="absolute inset-0 bg-muted opacity-50 blur-lg"></div>
                    <div className="relative z-10 text-lg">
                      No text responses so far
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{questionLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Created At</TableHead>
              <TableHead>Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response, index) => (
              <TableRow key={index}>
                <TableCell className="w-32 whitespace-nowrap">
                  {new Date(response.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="max-w-3xl break-words text-[14.5px]">
                  {response.text}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
