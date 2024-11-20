"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontal, Trash, Pencil, Archive, Copy } from "lucide-react";
import {
  type DuplicateSurveyType,
  type ArchiveSurveyType,
  type DeleteSurveyType,
  type RenameSurveyType,
} from "@/app/actions/survey";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

type SurveyActionsDropdownProps = {
  id: string;
  isArchived: boolean;
  surveyName: string;
  archiveSurvey: ArchiveSurveyType;
  deleteSurvey: DeleteSurveyType;
  renameSurvey: RenameSurveyType;
  duplicateSurvey: DuplicateSurveyType;
};

const SurveyActionsDropdown = ({
  id,
  surveyName,
  archiveSurvey,
  deleteSurvey,
  renameSurvey,
  duplicateSurvey,
  isArchived,
}: SurveyActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <RenameSurveyButton
            id={id}
            renameSurvey={renameSurvey}
            surveyName={surveyName}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            try {
              toast.loading("Duplicating survey...");
              await duplicateSurvey(id);
              toast.dismiss();
              toast.success("Survey duplicated successfully");
            } catch (error) {
              toast.error((error as Error).message);
            }
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Duplicate Survey
        </DropdownMenuItem>
        {!isArchived && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              try {
                await archiveSurvey(id);
                toast.success("Survey archived successfully");
              } catch (error) {
                toast.error((error as Error).message);
              }
            }}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteSurveyButton id={id} deleteSurvey={deleteSurvey} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SurveyActionsDropdown;

const DeleteSurveyButton = ({
  id,
  deleteSurvey,
}: {
  id: string;
  deleteSurvey: DeleteSurveyType;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start px-2 text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Survey</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this survey and all of its data?
            This action is permanent and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={async () => {
              try {
                await deleteSurvey(id);
                toast.success("Survey deleted successfully");
              } catch (error) {
                toast.error((error as Error).message);
              }
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const RenameSurveyButton = ({
  id,
  renameSurvey,
  surveyName,
}: {
  id: string;
  renameSurvey: RenameSurveyType;
  surveyName: string;
}) => {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().max(255, "Name must be less than 255 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: surveyName,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await renameSurvey(id, values.name);
      toast.success("Survey renamed successfully");
      setOpen(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start px-2 py-1 font-normal"
          size="sm"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Survey</DialogTitle>
          <DialogDescription>
            Enter a new name for your survey
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Survey name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
