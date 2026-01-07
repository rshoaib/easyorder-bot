import axios from 'axios';

const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const NOTIFICATION_API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

const headers = {
  Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

export const sendWhatsAppMessage = async (to: string, body: string) => {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to,
        text: { body },
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

export const sendTemplateMessage = async (to: string, templateName: string, languageCode: 'en_US' | string = 'en_US') => {
    // This is a placeholder for sending template messages
    // templates need to be created in the Meta Business Manager
    try {
        const response = await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: 'whatsapp',
                to,
                type: 'template',
                template: {
                    name: templateName,
                    language: {
                        code: languageCode
                    }
                }
            },
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending Template message:', error);
        throw error;
    }
}
