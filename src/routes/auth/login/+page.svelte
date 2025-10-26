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

  const { data, form }: PageProps = $props();
</script>

{form?.message}

<div class="w-screen h-screen flex justify-center items-center">
  <Card class="flex w-full max-w-sm flex-col gap-6">
    <CardHeader class="text-center">
      <CardTitle class="text-xl">Welcome</CardTitle>
      <CardDescription
        >Enter your email and password below to login to your account</CardDescription
      >
    </CardHeader>

    <form method="POST">
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
          />
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
          <Input id="password" name="password" type="password" />
        </div>
        <Button type="submit" class="cursor-pointer">Login</Button>

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
