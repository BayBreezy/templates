<template>
  <div class="flex h-screen items-center justify-center">
    <div class="w-full max-w-[360px] px-5">
      <Logo class="my-6 h-8" />

      <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">Log in</h1>
      <p class="mt-1 text-muted-foreground">Enter your email & password to log in.</p>

      <form class="mt-10" @submit="submit">
        <fieldset :disabled="isSubmitting" class="grid gap-5">
          <UiVeeInput label="Email" type="email" name="email" placeholder="john@example.com" />
          <StrongPasswordInput />
          <div class="flex items-start justify-between">
            <UiVeeCheckbox label="Remember me" name="remember" />
            <NuxtLink class="text-sm font-medium text-primary underline underline-offset-2" to="#"
              >Forgot password?</NuxtLink
            >
          </div>
          <UiButton class="w-full" type="submit" text="Log in" />
        </fieldset>
      </form>

      <p class="mt-6 text-sm text-muted-foreground">
        Don't have an account?
        <NuxtLink
          class="font-semibold text-primary underline-offset-2 hover:underline"
          to="/auth/register"
          >Create account</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({ layout: "auth", middleware: ["logged-in"] });
  useSeoMeta({
    title: "Log in",
    description: "Enter your email & password to log in.",
  });

  const { handleSubmit, isSubmitting } = useForm({
    name: "login-form",
    validationSchema: toTypedSchema(LoginSchema),
  });

  const submit = handleSubmit(async (values) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        rememberMe: values.remember,
      },
      {
        async onSuccess() {
          useSonner.success("Logged in successfully");
          await useAuth().getUser();
          await navigateTo("/admin/projects");
        },
        onError(context) {
          useSonner.error("Failed to log in", {
            description: context.error.message,
            duration: 12000,
          });
        },
      }
    );
  });
</script>
