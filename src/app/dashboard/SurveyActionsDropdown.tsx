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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setRenameDialogOpen(true)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              try {
                toast.loading("Duplicating survey...");
                const duplicatedSurveyId = await duplicateSurvey(id);
                toast.dismiss();
                router.push(`/survey/create/${duplicatedSurveyId}`);
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
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="cursor-pointer text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteSurveyDialog
        id={id}
        deleteSurvey={deleteSurvey}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
      <RenameSurveyDialog
        id={id}
        renameSurvey={renameSurvey}
        surveyName={surveyName}
        open={renameDialogOpen}
        setOpen={setRenameDialogOpen}
      />
    </>
  );
};

export default SurveyActionsDropdown;

const DeleteSurveyDialog = ({
  id,
  deleteSurvey,
  open,
  setOpen,
}: {
  id: string;
  deleteSurvey: DeleteSurveyType;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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

const RenameSurveyDialog = ({
  id,
  renameSurvey,
  surveyName,
  open,
  setOpen,
}: {
  id: string;
  renameSurvey: RenameSurveyType;
  surveyName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const formSchema = z.object({
    title: z.string().max(255, "Title must be less than 255 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: surveyName,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await renameSurvey(id, values.title);
      toast.success("Survey renamed successfully");
      setOpen(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Survey</DialogTitle>
          <DialogDescription>
            Enter a new title for your survey
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Survey title" {...field} />
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
