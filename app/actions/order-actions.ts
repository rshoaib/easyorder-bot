'use server';

import { getOrderRepository } from "@/lib/repository";
import { OrderStatus } from "@/lib/repository/types";
import { revalidatePath } from "next/cache";
import { verifyTenantOwnership } from "@/lib/auth/security";

export async function updateOrderStatus(id: string, status: OrderStatus, slug: string) {
    // Security Check
    await verifyTenantOwnership(slug);

    const repo = getOrderRepository();
    await repo.updateOrderStatus(id, status);
    revalidatePath(`/store/${slug}/admin`);
}
