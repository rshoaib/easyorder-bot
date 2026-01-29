import { createClient } from "@/utils/supabase/server";
import { getTenantRepository } from "@/lib/repository";
import { redirect } from "next/navigation";

export class AuthenticationError extends Error {
    constructor(message = "Unauthenticated") {
        super(message);
        this.name = "AuthenticationError";
    }
}

export class AuthorizationError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "AuthorizationError";
    }
}

/**
 * Verifies that the currently logged-in user is the owner of the tenant with the given slug.
 * @param slug The slug of the tenant to check.
 * @returns The tenant object if verification is successful.
 * @throws AuthenticationError if the user is not logged in.
 * @throws AuthorizationError if the user does not own the tenant.
 */
export async function verifyTenantOwnership(slug: string) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        // If we are in a server action, throwing or redirecting is appropriate.
        // Redirecting to login is usually the safest bet for full page loads, 
        // but for actions, throwing might be better handling by the caller.
        // However, standard pattern:
        throw new AuthenticationError("You must be logged in to perform this action.");
    }

    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) {
        throw new Error("Tenant not found");
    }

    // Check ownership
    // Note: tenant.userId should match user.id
    if (tenant.userId !== user.id) {
        console.error(`Security Alert: User ${user.id} attempted to access tenant ${tenant.id} owned by ${tenant.userId}`);
        throw new AuthorizationError("You do not have permission to manage this store.");
    }

    return { tenant, user };
}
