<template>
  <div>
    <slot name="title">
      <h2 v-if="title" class="text-xl font-semibold">{{ title }}</h2>
    </slot>
    <slot name="description">
      <p v-if="description">{{ description }}</p>
    </slot>

    <form class="mt-10" @submit="submit">
      <fieldset :disabled="isSubmitting" class="grid grid-cols-1 gap-5">
        <UiVeeInput name="name" label="Name" required icon="lucide:user" />
        <UiVeeInput
          name="email"
          label="Email"
          hint="Please reach out to support to change your email"
          readonly
          disabled
          icon="lucide:mail"
        />
        <div class="mt-4">
          <UiButton type="submit" variant="ringHover">Update account</UiButton>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script lang="ts" setup>
  const user = useUser();
  withDefaults(
    defineProps<{
      title?: string;
      description?: string;
    }>(),
    {
      title: "Personal",
      description: "Here you can update your personal details",
    }
  );

  const { handleSubmit, isSubmitting, setValues } = useForm({
    name: "personal-edit-form",
    validationSchema: toTypedSchema(UpdateAccountSchema),
    initialValues: {
      name: user?.value?.user?.name,
      email: user?.value?.user?.email,
    },
  });
  const submit = handleSubmit(async (values) => {
    await authClient.updateUser(
      {
        name: values.name,
      },
      {
        async onSuccess() {
          await useAuth().getUser();
          setValues({
            name: user?.value?.user?.name,
          });
          useSonner.success("Personal data updated successfully");
        },
        async onError(context) {
          useSonner.error("Unable to update account", {
            description: formatErrorMessage(context.error),
          });
        },
      }
    );
  });
</script>
