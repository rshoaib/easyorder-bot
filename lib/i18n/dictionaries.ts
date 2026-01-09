export type Locale = 'en' | 'es' | 'fr';

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
        poweredBy: "Powered by EasyOrder"
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
        poweredBy: "Creado con EasyOrder"
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
        poweredBy: "Propulsé par EasyOrder"
    }
};

export const getDictionary = (locale: Locale) => dictionaries[locale] || dictionaries.en;
