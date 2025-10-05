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
</script>

<div class="w-screen h-screen flex justify-center items-center">
  <Card class="flex w-full max-w-sm flex-col gap-6">
    <CardHeader class="text-center">
      <CardTitle class="text-xl">Create an Account</CardTitle>
      <CardDescription>
        Sign up to get started. Enter your details below to create your account.
      </CardDescription>
    </CardHeader>

    <CardContent class="grid gap-4">
      <div class="grid gap-2">
        <Label for="full_name">full name</Label>
        <Input id="full_name" />
      </div>

      <div class="grid gap-2">
        <Label for="email">email</Label>
        <Input id="email" type="email" />
      </div>

      <div class="grid gap-2">
        <Label for="password">Password</Label>
        <Input id="password" type="password" />
      </div>

      <div class="grid gap-2">
        <Label for="confirm_password">Confirm Password</Label>
        <Input id="confirm_password" type="password" />
      </div>

      <Button class="cursor-pointer">Signup</Button>

      <div class="text-center m-auto inline-block text-sm">
        Already have an account?
        <a
          href={Routes.login}
          class="underline underline-offset-4 text-cyan-500">Log In</a
        >
      </div>
    </CardContent>
  </Card>
</div>
