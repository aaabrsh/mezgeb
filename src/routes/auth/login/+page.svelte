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

  const { form } = $props();

  let pending = $state(false);
</script>

<div class="w-screen h-screen flex justify-center items-center">
  <Card class="flex w-[90%] max-w-sm flex-col gap-6">
    <CardHeader class="text-center">
      <CardTitle class="text-xl">Welcome</CardTitle>
      <CardDescription
        >Enter your email and password below to login to your account</CardDescription
      >
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
          <Label for="email">email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            class={form?.errors?.email ? "border-red-500" : ""}
          />
          {#if form?.errors?.email}
            <p class="text-xs text-red-500">{form.errors.email?.[0]}</p>
          {/if}
        </div>

        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <!-- <a
              href="##"
              class="ml-auto inline-block text-xs underline-offset-4 hover:underline text-cyan-500"
            >
              Forgot your password?
            </a> -->
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            class={form?.errors?.password ? "border-red-500" : ""}
          />
          {#if form?.errors?.password}
            <p class="text-xs text-red-500">
              {form.errors.password?.[0]}
            </p>
          {/if}
        </div>
        <Button type="submit" class="cursor-pointer" disabled={pending}>
          {#if pending}
            <span class="animate-pulse">Logging in...</span>
          {:else}
            Login
          {/if}
        </Button>

        <div class="text-center m-auto inline-block text-sm">
          Don't have an account?
          <a
            href={Routes.signup}
            class="underline underline-offset-4 text-cyan-500">Sign up</a
          >
        </div>
      </CardContent>
    </form>
  </Card>
</div>
