import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatOrderDateTime } from "./date-utils";
import { getCurrencySymbol } from "./currency";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    size?: string;
}

interface Order {
    id: string;
    date: string;
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    items: OrderItem[];
    subtotal?: number;
    deliveryFee?: number;
    discount?: number;
    total: number;
    timezone?: string;
}

interface StoreInfo {
    name: string;
    logoUrl?: string;
    currency?: string;
    themeColor?: string;
    ownerPhone?: string;
}

// Fetch logo and convert to base64 data URL for embedding in PDF
async function fetchLogoBase64(url: string): Promise<string | null> {
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return null;
        const buffer = await res.arrayBuffer();
        const contentType = res.headers.get('content-type') || 'image/png';
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:${contentType};base64,${base64}`;
    } catch {
        return null;
    }
}

// Parse hex color to RGB array
function hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export const generateInvoicePDF = async (order: Order, store?: StoreInfo) => {
    const doc = await buildInvoicePDF(order, store);

    // Return as arraybuffer for file saving (legacy support)
    return doc.output("arraybuffer");
};

export const generateInvoiceBuffer = async (order: Order, store?: StoreInfo): Promise<Buffer> => {
    const doc = await buildInvoicePDF(order, store);
    return Buffer.from(doc.output("arraybuffer"));
};

async function buildInvoicePDF(order: Order, store?: StoreInfo): Promise<jsPDF> {
    const doc = new jsPDF();
    const storeName = store?.name || 'OrderViaChat';
    const curr = getCurrencySymbol(store?.currency || 'USD');
    const accent = store?.themeColor ? hexToRgb(store.themeColor) : [79, 70, 229] as [number, number, number]; // indigo-600
    const pageW = doc.internal.pageSize.getWidth();

    // ═══════════════════════════════════════
    // HEADER — Accent bar + store branding
    // ═══════════════════════════════════════
    doc.setFillColor(accent[0], accent[1], accent[2]);
    doc.rect(0, 0, pageW, 4, 'F');  // Thin accent bar at top

    let headerY = 18;

    // Logo (if available)
    if (store?.logoUrl) {
        const logoData = await fetchLogoBase64(store.logoUrl);
        if (logoData) {
            try {
                doc.addImage(logoData, 'PNG', 20, 12, 18, 18);
                // Store name next to logo
                doc.setFontSize(20);
                doc.setTextColor(30, 30, 30);
                doc.text(storeName, 42, 24);
                headerY = 34;
            } catch {
                // If image fails, just use text
                doc.setFontSize(22);
                doc.setTextColor(30, 30, 30);
                doc.text(storeName, 20, 24);
                headerY = 32;
            }
        } else {
            doc.setFontSize(22);
            doc.setTextColor(30, 30, 30);
            doc.text(storeName, 20, 24);
            headerY = 32;
        }
    } else {
        doc.setFontSize(22);
        doc.setTextColor(30, 30, 30);
        doc.text(storeName, 20, 24);
        headerY = 32;
    }

    // "INVOICE" label on the right
    doc.setFontSize(28);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text("INVOICE", pageW - 20, 24, { align: 'right' });

    // Store phone under separator
    if (store?.ownerPhone) {
        doc.setFontSize(8);
        doc.setTextColor(130, 130, 130);
        doc.text(`Contact: ${store.ownerPhone}`, 20, headerY + 4);
        headerY += 7;
    }

    // Subtle separator
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(20, headerY, pageW - 20, headerY);

    // ═══════════════════════════════════════
    // META — Invoice ID + Date (left) / Bill To (right)
    // ═══════════════════════════════════════
    const metaY = headerY + 8;

    // Left column — Invoice details
    doc.setFontSize(8);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text("INVOICE #", 20, metaY);
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(order.id, 20, metaY + 5);

    doc.setFontSize(8);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text("DATE", 20, metaY + 14);
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(formatOrderDateTime(order.date, order.timezone), 20, metaY + 19);

    // Right column — Customer details
    const rightX = 120;
    doc.setFontSize(8);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text("BILL TO", rightX, metaY);

    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(order.customer.name, rightX, metaY + 5);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(order.customer.phone, rightX, metaY + 10);

    // Handle long addresses with wrapping
    const addrLines = doc.splitTextToSize(order.customer.address || '', 70);
    doc.text(addrLines, rightX, metaY + 15);

    // ═══════════════════════════════════════
    // TABLE — Items
    // ═══════════════════════════════════════
    const tableStartY = metaY + 30;
    const tableRows: any[] = [];

    order.items.forEach((item: any) => {
        const qty = Number(item.quantity || item.qty || 1);
        const price = Number(item.price || 0);
        const itemName = (item.selectedSize || item.size) ? `${item.name} (${item.selectedSize || item.size})` : item.name;
        tableRows.push([
            itemName,
            qty.toString(),
            `${curr}${price.toFixed(2)}`,
            `${curr}${(price * qty).toFixed(2)}`,
        ]);
    });

    // @ts-ignore
    autoTable(doc, {
        head: [["Item", "Qty", "Price", "Total"]],
        body: tableRows,
        startY: tableStartY,
        theme: 'plain',
        styles: {
            fontSize: 9.5,
            cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
            textColor: [50, 50, 50],
            lineColor: [230, 230, 230],
            lineWidth: 0.3,
        },
        headStyles: {
            fillColor: [accent[0], accent[1], accent[2]],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
        },
        alternateRowStyles: {
            fillColor: [248, 248, 252],
        },
        columnStyles: {
            0: { cellWidth: 'auto' },      // Item — flexible
            1: { cellWidth: 25, halign: 'center' },   // Qty
            2: { cellWidth: 35, halign: 'right' },     // Price
            3: { cellWidth: 35, halign: 'right' },     // Total
        },
    });

    // ═══════════════════════════════════════
    // TOTALS — Right-aligned summary
    // ═══════════════════════════════════════
    // @ts-ignore
    let y = doc.lastAutoTable.finalY + 6;

    const subtotal = order.subtotal || order.total;
    const deliveryFee = order.deliveryFee || 0;
    const discount = order.discount || 0;

    const totalsX = pageW - 24;
    const labelsX = totalsX - 50;

    // Subtotal
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Subtotal", labelsX, y, { align: 'right' });
    doc.setTextColor(50, 50, 50);
    doc.text(`${curr}${subtotal.toFixed(2)}`, totalsX, y, { align: 'right' });
    y += 6;

    // Delivery Fee (if any)
    if (deliveryFee > 0) {
        doc.setTextColor(120, 120, 120);
        doc.text("Delivery Fee", labelsX, y, { align: 'right' });
        doc.setTextColor(50, 50, 50);
        doc.text(`${curr}${deliveryFee.toFixed(2)}`, totalsX, y, { align: 'right' });
        y += 6;
    }

    // Discount (if any)
    if (discount > 0) {
        doc.setTextColor(120, 120, 120);
        doc.text("Discount", labelsX, y, { align: 'right' });
        doc.setTextColor(220, 38, 38); // red for discount
        doc.text(`-${curr}${discount.toFixed(2)}`, totalsX, y, { align: 'right' });
        y += 6;
    }

    // Separator line before grand total
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(labelsX - 10, y, totalsX, y);
    y += 7;

    // Grand Total (bold, accent colored)
    doc.setFontSize(14);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text("TOTAL", labelsX, y, { align: 'right' });
    doc.setTextColor(30, 30, 30);
    doc.text(`${curr}${order.total.toFixed(2)}`, totalsX, y, { align: 'right' });

    // ═══════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════
    y += 20;
    doc.setFontSize(10);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text("Thank you for your order!", 20, y);

    // Bottom bar with branding
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(248, 248, 250);
    doc.rect(0, pageH - 16, pageW, 16, 'F');

    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 170);
    doc.text("Powered by OrderViaChat.com", pageW / 2, pageH - 7, { align: 'center' });

    return doc;
}
