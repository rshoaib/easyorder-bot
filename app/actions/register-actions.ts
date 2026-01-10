'use server';

import { getTenantRepository } from "@/lib/repository";
// Send Welcome Email (Fire and forget)
const { sendWelcomeEmail } = await import('@/lib/email');
sendWelcomeEmail(email, name, slug).catch(console.error);

return { success: true, pending: true, tenantId: tenant.id };

    } catch (error: any) {
    console.error("Registration Error:", error);
    return { error: error.message || "Something went wrong. Please try again." };
}
}
