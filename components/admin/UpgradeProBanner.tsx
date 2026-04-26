/**
 * UpgradeProBanner
 *
 * Previously showed a "$10/mo upgrade to Pro" banner at the top of the
 * admin dashboard. OrderViaChat is now 100% free for all stores —
 * customization is the only paid offering and it's sold via the
 * /services page, not via an in-admin banner.
 *
 * This component is kept as a no-op so existing call sites don't need
 * to be edited. It can be removed entirely once the call sites are
 * updated.
 */
interface Props {
    tenantId: string;
    slug: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UpgradeProBanner(_props: Props) {
    return null;
}
