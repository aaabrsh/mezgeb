import type { Tag } from "@prisma-generated/client";
import prisma from "@/server/prisma";
import type { TagFormData } from "@/schemas/tag.schema";

export const getTagsForUser = async (userId: string): Promise<Tag[]> => {
  return prisma.tag.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getTagByName = async (
  name: string,
  userId: string,
): Promise<Tag | null> => {
  return prisma.tag.findUnique({
    where: { userId_name: { name, userId } },
  });
};

export const getTagById = async (
  id: string,
  userId: string,
): Promise<Tag | null> => {
  return prisma.tag.findUnique({ where: { id, userId } });
};

export const createTag = async (
  data: TagFormData,
  userId: string,
): Promise<Tag> => {
  return prisma.tag.create({ data: { ...data, userId } });
};

export const updateTag = async (
  tagId: string,
  data: TagFormData,
  userId: string,
): Promise<Tag> => {
  return prisma.tag.update({
    where: { id: tagId, userId },
    data,
  });
};

export const deleteTag = async (
  id: string,
  userId: string,
): Promise<Tag | null> => {
  return prisma.tag.delete({ where: { id, userId } });
};
