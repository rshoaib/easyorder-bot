'use server';

import { getOrderRepository } from "@/lib/repository";
import { OrderStatus } from "@/lib/repository/types";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(id: string, status: OrderStatus, slug: string) {
    const repo = getOrderRepository();
    // In a real app, verify tenant ownership here.
    await repo.updateOrderStatus(id, status);
    revalidatePath(`/store/${slug}/admin`);
}
