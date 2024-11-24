import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import { Button, FormControl, Input, Select, SelectItem } from "@app/components/v2";
import { useUpdateUserCredential } from "@app/hooks/api/userCredentials/mutations";
import {
  TUpdateUserCredentialRequest,
  TUserCredential
} from "@app/hooks/api/userCredentials/types";
import { UsePopUpState } from "@app/hooks/usePopUp";

const baseSchema = z.object({
  type: z.enum(["login", "card", "note"]),
  name: z.string().min(1, "Name is required")
});

const webLoginSchema = baseSchema.extend({
  type: z.literal("login"),
  url: z.string().min(1, "URL is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

const creditCardSchema = baseSchema.extend({
  type: z.literal("card"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  number: z.string().min(1, "Card number is required"),
  expMonth: z.string().min(1, "Expiry month is required"),
  expYear: z.string().min(1, "Expiry year is required"),
  code: z.string().min(1, "CVV is required")
});

const secureNoteSchema = baseSchema.extend({
  type: z.literal("note"),
  content: z.string().min(1, "Content is required")
});

export const schema = z.discriminatedUnion("type", [
  webLoginSchema,
  creditCardSchema,
  secureNoteSchema
]);

export type FormData = z.infer<typeof schema>;

const typeOptions = [
  { label: "Web Login", value: "login" },
  { label: "Credit Card", value: "card" },
  { label: "Secure Note", value: "note" }
];

export const UpdateUserCredentialForm = ({
  initialData,
  handlePopUpToggle
}: {
  initialData?: TUserCredential;
  handlePopUpToggle: (
    popUpName: keyof UsePopUpState<["updateUserCredential"]>,
    state?: boolean
  ) => void;
}) => {
  const updateUserCredential = useUpdateUserCredential();

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...initialData
    }
  });

  const selectedType = watch("type"); // Watch for type changes

  const renderTypeSpecificFields = () => {
    switch (selectedType) {
      case "login":
        return (
          <>
            <Controller
              control={control}
              name="url"
              render={({ field, fieldState: { error } }) => (
                <FormControl label="URL" isError={Boolean(error)} errorText={error?.message}>
                  <Input {...field} placeholder="startupschool.org" type="text" />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="username"
              render={({ field, fieldState: { error } }) => (
                <FormControl label="Username" isError={Boolean(error)} errorText={error?.message}>
                  <Input {...field} placeholder="username@example.com" type="text" />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <FormControl label="Password" isError={Boolean(error)} errorText={error?.message}>
                  <Input {...field} placeholder="********" type="password" />
                </FormControl>
              )}
            />
          </>
        );

      case "card":
        return (
          <>
            <Controller
              control={control}
              name="cardholderName"
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  label="Cardholder Name"
                  isError={Boolean(error)}
                  errorText={error?.message}
                >
                  <Input {...field} placeholder="John Doe" type="text" />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="number"
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  label="Card Number"
                  isError={Boolean(error)}
                  errorText={error?.message}
                >
                  <Input {...field} placeholder="4111 1111 1111 1111" type="text" />
                </FormControl>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <Controller
                  control={control}
                  name="expMonth"
                  render={({ field, fieldState: { error } }) => (
                    <FormControl label="Month" isError={Boolean(error)} errorText={error?.message}>
                      <Input {...field} placeholder="MM" type="text" maxLength={2} />
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="expYear"
                  render={({ field, fieldState: { error } }) => (
                    <FormControl label="Year" isError={Boolean(error)} errorText={error?.message}>
                      <Input {...field} placeholder="YY" type="text" maxLength={2} />
                    </FormControl>
                  )}
                />
              </div>
              <Controller
                control={control}
                name="code"
                render={({ field, fieldState: { error } }) => (
                  <FormControl label="CVV" isError={Boolean(error)} errorText={error?.message}>
                    <Input {...field} placeholder="123" type="text" maxLength={4} />
                  </FormControl>
                )}
              />
            </div>
          </>
        );

      case "note":
        return (
          <Controller
            control={control}
            name="content"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="Secure Note" isError={Boolean(error)} errorText={error?.message}>
                <textarea
                  {...field}
                  placeholder="Enter your secure note..."
                  className="h-40 min-h-[70px] w-full rounded-md border border-mineshaft-600 bg-mineshaft-900 py-3 px-3 text-sm text-bunker-300 placeholder-gray-500 placeholder-opacity-50 outline-none transition-all hover:border-primary-400/30 focus:border-primary-400/50"
                />
              </FormControl>
            )}
          />
        );
      default:
        throw new Error("Unexpected type");
    }
  };

  const onFormSubmit = async (data: FormData) => {
    try {
      await updateUserCredential.mutateAsync({
        ...data,
        id: initialData?.id
      } as TUpdateUserCredentialRequest);

      reset();
      handlePopUpToggle("updateUserCredential", false);

      createNotification({
        text: "User credential updated successfully.",
        type: "success"
      });
    } catch (error) {
      console.error(error);
      createNotification({
        text: "Failed to update a user credential.",
        type: "error"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Controller
        control={control}
        name="type"
        defaultValue="login"
        render={({ field: { onChange, ...field }, fieldState: { error } }) => (
          <FormControl label="Type" errorText={error?.message} isError={Boolean(error)}>
            <Select
              defaultValue={field.value}
              {...field}
              onValueChange={(e) => onChange(e)}
              className="w-full"
            >
              {typeOptions.map(({ label, value: typeValue }) => (
                <SelectItem value={String(typeValue || "")} key={label}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error } }) => (
          <FormControl label="Name" isError={Boolean(error)} errorText={error?.message}>
            <Input
              {...field}
              placeholder={selectedType === "login" ? "YC Startup School" : "Silicon Valley Bank"}
              type="text"
            />
          </FormControl>
        )}
      />

      {renderTypeSpecificFields()}

      <Button
        className="mt-4"
        size="sm"
        type="submit"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        Update Credential
      </Button>
    </form>
  );
};
