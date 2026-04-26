/**
 * ProGate
 *
 * Previously showed a "Locked — Upgrade to Pro" overlay over Integrations
 * and Blog admin pages for free-plan stores. OrderViaChat is now 100% free
 * for everyone, so every store gets full access to all features. This
 * component is now a transparent pass-through.
 *
 * Kept around (rather than removed at call sites) so existing imports keep
 * working. Safe to delete the wrapper at /store/<slug>/admin/integrations
 * and /admin/blog when convenient.
 */
interface ProGateProps {
    plan?: string;
    featureName: string;
    slug: string;
    children: React.ReactNode;
}

export default function ProGate({ children }: ProGateProps) {
    return <>{children}</>;
}
