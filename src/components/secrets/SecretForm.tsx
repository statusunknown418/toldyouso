"use client";

import {
  NewSecretParams,
  Secret,
  insertSecretParams,
} from "@/lib/db/schema/secrets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "../ui/button";

const SecretForm = ({
  secret,
  closeModal,
}: {
  secret?: Secret;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!secret?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertSecretParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertSecretParams),
    defaultValues: secret ?? {
      title: "",
      content: "",
    },
  });

  const onSuccess = (action: "create" | "update" | "delete") => {
    utils.secrets.getSecrets.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Secret ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createSecret, isLoading: isCreating } =
    trpc.secrets.createSecret.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateSecret, isLoading: isUpdating } =
    trpc.secrets.updateSecret.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteSecret, isLoading: isDeleting } =
    trpc.secrets.deleteSecret.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewSecretParams) => {
    if (editing) {
      updateSecret({ ...values, id: secret.id });
    } else {
      createSecret(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteSecret({ id: secret.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default SecretForm;
