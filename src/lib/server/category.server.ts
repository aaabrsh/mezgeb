import type { Category } from "@prisma-generated/client";
import prisma from "@/server/prisma";
import type { CategoryFormData } from "@/schemas/category.schema";

export const getCategoriesForUser = async (
  userId: string
): Promise<Category[]> => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getCategoryByName = async (
  name: string,
  userId: string
): Promise<Category | null> => {
  return prisma.category.findUnique({
    where: { userId_name: { name, userId } },
  });
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  return prisma.category.findUnique({ where: { id } });
};

export const createCategory = async (
  data: CategoryFormData,
  userId: string
): Promise<Category> => {
  return prisma.category.create({ data: { ...data, userId } });
};

export const updateCategory = async (
  categoryId: string,
  data: CategoryFormData,
  userId: string
): Promise<Category> => {
  return prisma.category.update({
    where: { id: categoryId, userId },
    data,
  });
};

export const deleteCategory = async (
  id: string,
  userId: string
): Promise<Category | null> => {
  return prisma.category.delete({ where: { id, userId } });
};
