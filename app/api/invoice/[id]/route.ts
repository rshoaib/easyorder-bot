import { NextRequest, NextResponse } from 'next/server';
import { getOrderRepository, getTenantRepository } from '@/lib/repository';
import { generateInvoiceBuffer } from '@/lib/invoice';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) {
            return new NextResponse('Missing Order ID', { status: 400 });
        }

        const supabase = await createClient();
        const repo = getOrderRepository(supabase);

        // Fetch order from DB (Supabase in Prod, or JSON in Dev)
        const order = await repo.getOrderById(id);


        if (!order) {
            return new NextResponse('Order not found', { status: 404 });
        }

        // Fetch tenant to get timezone for correct date display on invoice
        const tenantRepo = getTenantRepository(supabase);
        const tenant = await tenantRepo.getTenantById(order.tenantId);

        // Generate PDF in memory (pass timezone and store info for branding)
        const storeInfo = tenant ? { name: tenant.name, logoUrl: tenant.logoUrl, currency: tenant.currency, themeColor: tenant.themeColor, ownerPhone: tenant.ownerPhone } : undefined;
        const pdfBuffer = await generateInvoiceBuffer({ ...order, timezone: tenant?.timezone }, storeInfo);

        // Return as PDF file
        return new NextResponse(pdfBuffer as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="invoice_${id}.pdf"`,
            },
        });

    } catch (error) {
        console.error('Error serving invoice:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
