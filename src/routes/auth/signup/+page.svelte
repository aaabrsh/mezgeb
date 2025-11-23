<script lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Routes } from "@/data/routes";
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";

  const { data, form }: PageProps = $props();

  let pending = $state(false);
</script>

<div class="w-screen h-screen flex justify-center items-center">
  <Card class="flex w-[90%] max-w-sm flex-col gap-6">
    <CardHeader class="text-center">
      <CardTitle class="text-xl">Create an Account</CardTitle>
      <CardDescription>
        Sign up to get started. Enter your details below to create your account.
      </CardDescription>
    </CardHeader>

    <form
      method="POST"
      use:enhance={() => {
        pending = true;

        return async ({ update }) => {
          await update();
          pending = false;
        };
      }}
    >
      <CardContent class="grid gap-4">
        {#if form?.message}
          <div
            class="p-3 text-sm rounded-md border bg-red-50 border-red-500 text-red-600 font-semibold"
            transition:fade
          >
            {form.message}
          </div>
        {/if}

        <div class="grid gap-2">
          <Label for="full_name">full name</Label>
          <Input
            id="full_name"
            name="full_name"
            class={form?.errors?.full_name ? "border-red-500" : ""}
          />
          {#if form?.errors?.full_name}
            <p class="text-xs text-red-500" transition:fade>
              {form.errors.full_name?.[0]}
            </p>
          {/if}
        </div>

        <div class="grid gap-2">
          <Label for="email">email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            class={form?.errors?.email ? "border-red-500" : ""}
          />
          {#if form?.errors?.email}
            <p class="text-xs text-red-500" transition:fade>
              {form.errors.email?.[0]}
            </p>
          {/if}
        </div>

        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            class={form?.errors?.password ? "border-red-500" : ""}
          />
          {#if form?.errors?.password}
            <p class="text-xs text-red-500" transition:fade>
              {form.errors.password?.[0]}
            </p>
          {/if}
        </div>

        <div class="grid gap-2">
          <Label
            for="confirm_password"
            class={form?.errors?.confirm_password ? "border-red-500" : ""}
          >
            Confirm Password
          </Label>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            class={form?.errors?.confirm_password ? "border-red-500" : ""}
          />
          {#if form?.errors?.confirm_password}
            <p class="text-xs text-red-500" transition:fade>
              {form.errors.confirm_password?.[0]}
            </p>
          {/if}
        </div>

        <Button
          type="submit"
          class="cursor-pointer"
          loading={pending}
          disabled={pending}
        >
          {#if pending}
            <span class="animate-pulse">Signing in...</span>
          {:else}
            Signup
          {/if}
        </Button>

        <div class="text-center m-auto inline-block text-sm">
          Already have an account?
          <a
            href={Routes.login}
            class="underline underline-offset-4 text-cyan-500"
          >
            Log In
          </a>
        </div>
      </CardContent>
    </form>
  </Card>
</div>
