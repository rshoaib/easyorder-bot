import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";
import path from "path";

// Define the Order interface locally to avoid circular deps, or import if shared properly
interface OrderItem {
    name: string;
    quantity: number;
    price: number;
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
}

export const generateInvoicePDF = async (order: Order) => {
    const doc = new jsPDF();

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text("EasyOrder Invoice", 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice ID: ${order.id}`, 20, 30);
    doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 20, 35);

    // --- Customer Details ---
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Bill To:", 20, 50);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Name: ${order.customer.name}`, 20, 56);
    doc.text(`Phone: ${order.customer.phone}`, 20, 61);
    doc.text(`Address: ${order.customer.address}`, 20, 66);

    // --- Order Items Table ---
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows: any[] = [];

    order.items.forEach((item) => {
        const itemData = [
            item.name,
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${(item.price * item.quantity).toFixed(2)}`,
        ];
        tableRows.push(itemData);
    });

    // @ts-ignore
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 75,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0] }
    });

    // --- Total ---
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Grand Total: $${order.total.toFixed(2)}`, 20, finalY);

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 20, finalY + 20);

    // --- Save to Public Folder ---
    // Ensure "public/invoices" exists
    const invoiceDir = path.join(process.cwd(), "public", "invoices");
    if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const fileName = `invoice_${order.id}.pdf`;
    const filePath = path.join(invoiceDir, fileName);

    // Save the PDF
    const pdfOutput = doc.output("arraybuffer");
    fs.writeFileSync(filePath, Buffer.from(pdfOutput));

    // Return public URL (Assuming ngrok or localhost)
    // We'll trust the caller to prepend the domain or we can hardcode the current one if known.
    // For better flexibility, we return the relative path.
    return `/invoices/${fileName}`;
};

export const generateInvoiceBuffer = async (order: Order): Promise<Buffer> => {
    const doc = new jsPDF();

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text("EasyOrder Invoice", 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice ID: ${order.id}`, 20, 30);
    doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 20, 35);

    // --- Customer Details ---
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Bill To:", 20, 50);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Name: ${order.customer.name}`, 20, 56);
    doc.text(`Phone: ${order.customer.phone}`, 20, 61);
    doc.text(`Address: ${order.customer.address}`, 20, 66);

    // --- Order Items Table ---
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows: any[] = [];

    order.items.forEach((item) => {
        const itemData = [
            item.name,
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${(item.price * item.quantity).toFixed(2)}`,
        ];
        tableRows.push(itemData);
    });

    // Add Delivery Fee if present
    if ((order.deliveryFee || 0) > 0) {
        tableRows.push(['Delivery Fee', '', '', `$${(order.deliveryFee || 0).toFixed(2)}`]);
    }

    // @ts-ignore
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 75,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0] }
    });

    // --- Total ---
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Grand Total: $${order.total.toFixed(2)}`, 20, finalY);

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 20, finalY + 20);

    return Buffer.from(doc.output("arraybuffer"));
};
