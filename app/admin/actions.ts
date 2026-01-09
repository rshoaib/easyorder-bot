'use server';

import { getOrderRepository } from "@/lib/repository";
import { OrderStatus } from "@/lib/repository/types";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const repo = getOrderRepository();

    // 1. Update Database
    await repo.updateOrderStatus(orderId, newStatus);

    // 2. Fetch Order to get Customer Phone
    const order = await repo.getOrderById(orderId);

    if (order && order.customer && order.customer.phone) {
        // 3. Send Notification Logic
        let message = "";

        switch (newStatus) {
            case 'preparing':
                message = `🔥 *Order Update: Preparing!*
                
High five! The kitchen has started preparing your order.
We will let you know when it's ready!`;
                break;

            case 'ready':
                message = `🚀 *Order Update: Ready!*
                
Good news! Your order is ready for pickup/delivery.
Get your appetite ready! 😋`;
                break;

            case 'delivered':
                message = `✅ *Order Update: Delivered*
                
Your order has been completed.
Thank you for choosing EasyOrder!
We hope you enjoy your meal. 🌟`;
                break;

            case 'cancelled':
                message = `❌ *Order Status: Cancelled*
                
Your order #${orderId} has been cancelled.
Please contact us if you have any questions.`;
                break;
        }

        if (message) {
            const cleanPhone = order.customer.phone.replace(/\D/g, '');
            await sendWhatsAppMessage(cleanPhone, message);
        }
    }

    revalidatePath('/admin');
}
