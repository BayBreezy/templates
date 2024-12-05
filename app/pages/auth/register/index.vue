<template>
  <div class="flex h-screen items-center justify-center">
    <div class="w-full max-w-[360px] px-5">
      <Logo class="my-6 h-8" />

      <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">Create Account</h1>
      <p class="mt-1 text-muted-foreground">Fill out the form to create an account.</p>

      <form class="mt-10" @submit="submit">
        <fieldset :disabled="isSubmitting" class="grid gap-5">
          <UiVeeInput label="Name" name="name" placeholder="John Doe" />
          <UiVeeInput label="Email" type="email" name="email" placeholder="john@example.com" />
          <StrongPasswordInput />
          <UiButton class="w-full" type="submit" text="Create Account" />
        </fieldset>
      </form>

      <p class="mt-6 text-sm text-muted-foreground">
        Already have an account?
        <NuxtLink
          class="font-semibold text-primary underline-offset-2 hover:underline"
          to="/auth/login"
          >Login here</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({ layout: "auth", middleware: ["logged-in"] });
  useSeoMeta({
    title: "Create Account",
    description: "Fill out the form to create an account.",
  });

  const { handleSubmit, isSubmitting } = useForm({
    name: "create-account-form",
    validationSchema: toTypedSchema(RegisterSchema),
  });

  const submit = handleSubmit(async (values) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        async onSuccess() {
          useSonner.success("Account created", {
            description: "You have successfully created an account.",
          });
          await useAuth().getUser();
          await navigateTo("/admin/projects");
        },
        onError(context) {
          useSonner.error("Failed to create account", {
            description: context.error.message,
            duration: 12000,
          });
        },
      }
    );
  });
</script>
