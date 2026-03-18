import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";
import path from "path";
import { formatOrderDateTime } from "./date-utils";
import { getCurrencySymbol } from "./currency";

// Define the Order interface locally to avoid circular deps
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
    total: number;
    timezone?: string;
}

interface StoreInfo {
    name: string;
    logoUrl?: string;
    currency?: string;
}

export const generateInvoicePDF = async (order: Order, store?: StoreInfo) => {
    const doc = new jsPDF();
    const storeName = store?.name || 'OrderViaChat';
    const currencySymbol = getCurrencySymbol(store?.currency || 'USD');

    // --- Header with Store Name ---
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text(`${storeName}`, 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Invoice", 20, 28);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice ID: ${order.id}`, 20, 36);
    doc.text(`Date: ${formatOrderDateTime(order.date, order.timezone)}`, 20, 41);

    // --- Customer Details ---
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Bill To:", 20, 56);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Name: ${order.customer.name}`, 20, 62);
    doc.text(`Phone: ${order.customer.phone}`, 20, 67);
    doc.text(`Address: ${order.customer.address}`, 20, 72);

    // --- Order Items Table ---
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows: any[] = [];

    order.items.forEach((item: any) => {
        const qty = Number(item.quantity || item.qty || 1);
        const price = Number(item.price || 0);
        const itemName = item.size ? `${item.name} (${item.size})` : item.name;
        const itemData = [
            itemName,
            qty.toString(),
            `${currencySymbol}${price.toFixed(2)}`,
            `${currencySymbol}${(price * qty).toFixed(2)}`,
        ];
        tableRows.push(itemData);
    });

    // @ts-ignore
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0] }
    });

    // --- Total ---
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Grand Total: ${currencySymbol}${order.total.toFixed(2)}`, 20, finalY);

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 20, finalY + 20);

    doc.setFontSize(8);
    doc.setTextColor(180);
    doc.text("Powered by OrderViaChat.com", 20, finalY + 28);

    // --- Save to Public Folder ---
    const invoiceDir = path.join(process.cwd(), "public", "invoices");
    if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const fileName = `invoice_${order.id}.pdf`;
    const filePath = path.join(invoiceDir, fileName);

    const pdfOutput = doc.output("arraybuffer");
    fs.writeFileSync(filePath, Buffer.from(pdfOutput));

    return `/invoices/${fileName}`;
};

export const generateInvoiceBuffer = async (order: Order, store?: StoreInfo): Promise<Buffer> => {
    const doc = new jsPDF();
    const storeName = store?.name || 'OrderViaChat';
    const currencySymbol = getCurrencySymbol(store?.currency || 'USD');

    // --- Header with Store Name ---
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text(`${storeName}`, 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Invoice", 20, 28);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice ID: ${order.id}`, 20, 36);
    doc.text(`Date: ${formatOrderDateTime(order.date, order.timezone)}`, 20, 41);

    // --- Customer Details ---
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Bill To:", 20, 56);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Name: ${order.customer.name}`, 20, 62);
    doc.text(`Phone: ${order.customer.phone}`, 20, 67);
    doc.text(`Address: ${order.customer.address}`, 20, 72);

    // --- Order Items Table ---
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows: any[] = [];

    order.items.forEach((item: any) => {
        const qty = Number(item.quantity || item.qty || 1);
        const price = Number(item.price || 0);
        const itemName = item.size ? `${item.name} (${item.size})` : item.name;
        const itemData = [
            itemName,
            qty.toString(),
            `${currencySymbol}${price.toFixed(2)}`,
            `${currencySymbol}${(price * qty).toFixed(2)}`,
        ];
        tableRows.push(itemData);
    });

    // Add Delivery Fee if present
    if ((order.deliveryFee || 0) > 0) {
        tableRows.push(['Delivery Fee', '', '', `${currencySymbol}${(order.deliveryFee || 0).toFixed(2)}`]);
    }

    // @ts-ignore
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0] }
    });

    // --- Total ---
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Grand Total: ${currencySymbol}${order.total.toFixed(2)}`, 20, finalY);

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 20, finalY + 20);

    doc.setFontSize(8);
    doc.setTextColor(180);
    doc.text("Powered by OrderViaChat.com", 20, finalY + 28);

    return Buffer.from(doc.output("arraybuffer"));
};
