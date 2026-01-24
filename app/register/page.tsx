import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RegisterForm from "./form";

export default async function RegisterPage() {
    const supabase = await createClient(); // Await the async createClient
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?next=/register');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <RegisterForm userEmail={user.email!} />
        </div>
    );
}
