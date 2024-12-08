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
        <UiVeeInput name="currentPassword" label="Current Password" type="password" required />
        <StrongPasswordInput label="New Password" name="newPassword" />
        <div class="mt-3">
          <UiVeeCheckbox
            name="revokeOtherSessions"
            label="Revoke other sessions?"
            hint="Selecting this option will log you out of all other devices."
          />
        </div>

        <div class="mt-4">
          <UiButton type="submit" variant="ringHover">
            <span v-if="!isSubmitting"> Update password </span>
            <Icon v-else name="svg-spinners:8-dots-rotate" class="size-5" />
          </UiButton>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(
    defineProps<{
      title?: string;
      description?: string;
    }>(),
    {
      title: "Update Password",
      description: "Here you can update password.",
    }
  );

  const { handleSubmit, isSubmitting, resetForm } = useForm({
    name: "password-update-form",
    validationSchema: toTypedSchema(UpdatePasswordSchema),
  });
  const submit = handleSubmit(async (values) => {
    await authClient.changePassword(values, {
      async onSuccess() {
        await useAuth().getUser();
        resetForm();
        useSonner.success("Password updated successfully");
      },
      async onError(context) {
        useSonner.error("Unable to update password", {
          description: formatErrorMessage(context.error),
        });
      },
    });
  });
</script>
