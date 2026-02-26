'use server';

import { getOrderRepository } from "@/lib/repository";
import { OrderStatus } from "@/lib/repository/types";
import { revalidatePath } from "next/cache";
import { verifyTenantOwnership } from "@/lib/auth/security";
import { createClient } from "@/utils/supabase/server";

export async function updateOrderStatus(id: string, status: OrderStatus, slug: string) {
    // Security Check
    await verifyTenantOwnership(slug);

    const supabase = await createClient();
    const repo = getOrderRepository(supabase);
    await repo.updateOrderStatus(id, status);
    revalidatePath(`/store/${slug}/admin`);
    revalidatePath(`/store/${slug}/admin/orders`);
}

