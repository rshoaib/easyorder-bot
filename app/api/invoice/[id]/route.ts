import { NextRequest, NextResponse } from 'next/server';
import { getOrderRepository } from '@/lib/repository';
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

        // Generate PDF in memory
        const pdfBuffer = await generateInvoiceBuffer(order);

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
