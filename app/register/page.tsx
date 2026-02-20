import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getTenantRepository } from "@/lib/repository";
import RegisterForm from "./form";

export default async function RegisterPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?next=/register');
    }

    // Check if user already has a store → redirect to their admin
    const tenantRepo = getTenantRepository(supabase);
    const existingTenant = await tenantRepo.getTenantByUserId(user.id);

    if (existingTenant) {
        redirect(`/store/${existingTenant.slug}/admin`);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <RegisterForm userEmail={user.email!} />
        </div>
    );
}
