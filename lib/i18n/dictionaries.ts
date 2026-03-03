export type Locale = 'en' | 'es' | 'fr' | 'ar' | 'pt' | 'id';

// RTL languages
export const RTL_LOCALES: Locale[] = ['ar'];
export const isRTL = (locale: Locale) => RTL_LOCALES.includes(locale);

export const dictionaries = {
    en: {
        searchPlaceholder: "Search menu...",
        addToOrder: "Add to Order",
        viewCart: "View Order",
        total: "Total",
        checkout: "Checkout via WhatsApp",
        emptyCart: "Your cart is empty",
        outOfStock: "Sold Out",
        delivery: "Delivery",
        subtotal: "Subtotal",
        promoCode: "Promo Code",
        apply: "Apply",
        discount: "Discount",
        name: "Name",
        phone: "WhatsApp Number",
        address: "Delivery Address",
        pinCode: "Maps Link (Optional)",
        payNow: "Send Order",
        poweredBy: "Powered by",
        openNow: "Open Now",
        closed: "Closed",
        items: "items",
        viewCartBtn: "View Cart",
    },
    es: {
        searchPlaceholder: "Buscar en el menú...",
        addToOrder: "Agregar",
        viewCart: "Ver Pedido",
        total: "Total",
        checkout: "Completar en WhatsApp",
        emptyCart: "Tu carrito está vacío",
        outOfStock: "Agotado",
        delivery: "Envío",
        subtotal: "Subtotal",
        promoCode: "Código Promocional",
        apply: "Aplicar",
        discount: "Descuento",
        name: "Nombre",
        phone: "Número de WhatsApp",
        address: "Dirección de Entrega",
        pinCode: "Link de Google Maps (Opcional)",
        payNow: "Enviar Pedido",
        poweredBy: "Creado con",
        openNow: "Abierto",
        closed: "Cerrado",
        items: "artículos",
        viewCartBtn: "Ver Carrito",
    },
    fr: {
        searchPlaceholder: "Rechercher...",
        addToOrder: "Ajouter",
        viewCart: "Voir Panier",
        total: "Total",
        checkout: "Commander sur WhatsApp",
        emptyCart: "Votre panier est vide",
        outOfStock: "Épuisé",
        delivery: "Livraison",
        subtotal: "Sous-total",
        promoCode: "Code Promo",
        apply: "Appliquer",
        discount: "Remise",
        name: "Nom",
        phone: "Numéro WhatsApp",
        address: "Adresse de livraison",
        pinCode: "Lien Maps (Optionnel)",
        payNow: "Envoyer la commande",
        poweredBy: "Propulsé par",
        openNow: "Ouvert",
        closed: "Fermé",
        items: "articles",
        viewCartBtn: "Voir Panier",
    },
    ar: {
        searchPlaceholder: "ابحث في القائمة...",
        addToOrder: "أضف للطلب",
        viewCart: "عرض الطلب",
        total: "المجموع",
        checkout: "اطلب عبر واتساب",
        emptyCart: "سلة المشتريات فارغة",
        outOfStock: "نفذت الكمية",
        delivery: "التوصيل",
        subtotal: "المجموع الفرعي",
        promoCode: "كود الخصم",
        apply: "تطبيق",
        discount: "خصم",
        name: "الاسم",
        phone: "رقم الواتساب",
        address: "عنوان التوصيل",
        pinCode: "رابط الموقع (اختياري)",
        payNow: "إرسال الطلب",
        poweredBy: "مدعوم بواسطة",
        openNow: "مفتوح الآن",
        closed: "مغلق",
        items: "عناصر",
        viewCartBtn: "عرض السلة",
    },
    pt: {
        searchPlaceholder: "Buscar no cardápio...",
        addToOrder: "Adicionar",
        viewCart: "Ver Pedido",
        total: "Total",
        checkout: "Pedir pelo WhatsApp",
        emptyCart: "Seu carrinho está vazio",
        outOfStock: "Esgotado",
        delivery: "Entrega",
        subtotal: "Subtotal",
        promoCode: "Código Promocional",
        apply: "Aplicar",
        discount: "Desconto",
        name: "Nome",
        phone: "Número do WhatsApp",
        address: "Endereço de Entrega",
        pinCode: "Link do Maps (Opcional)",
        payNow: "Enviar Pedido",
        poweredBy: "Desenvolvido por",
        openNow: "Aberto",
        closed: "Fechado",
        items: "itens",
        viewCartBtn: "Ver Carrinho",
    },
    id: {
        searchPlaceholder: "Cari menu...",
        addToOrder: "Tambahkan",
        viewCart: "Lihat Pesanan",
        total: "Total",
        checkout: "Pesan via WhatsApp",
        emptyCart: "Keranjang Anda kosong",
        outOfStock: "Habis",
        delivery: "Pengiriman",
        subtotal: "Subtotal",
        promoCode: "Kode Promo",
        apply: "Terapkan",
        discount: "Diskon",
        name: "Nama",
        phone: "Nomor WhatsApp",
        address: "Alamat Pengiriman",
        pinCode: "Link Maps (Opsional)",
        payNow: "Kirim Pesanan",
        poweredBy: "Dibuat oleh",
        openNow: "Buka",
        closed: "Tutup",
        items: "item",
        viewCartBtn: "Lihat Keranjang",
    }
};

export type Dictionary = typeof dictionaries.en;

export const getDictionary = (locale: Locale) => dictionaries[locale] || dictionaries.en;

/**
 * Auto-detect the best locale from browser language.
 * Maps browser lang codes to our supported locales.
 */
export function detectLocale(): Locale {
    if (typeof navigator === 'undefined') return 'en';

    const browserLang = (navigator.language || '').toLowerCase();

    // Exact or prefix matches
    if (browserLang.startsWith('ar')) return 'ar';
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang.startsWith('id') || browserLang.startsWith('ms')) return 'id'; // Malay is close to Indonesian
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('fr')) return 'fr';

    return 'en';
}
