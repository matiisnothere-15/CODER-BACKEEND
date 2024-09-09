import { config } from "../config/config.js";
import transporter from "../config/mailing.js";
import nodemailer from 'nodemailer';

// Función para enviar correos electrónicos genéricos
export const sendEmail = async (to, subject, html) => {
    try {
        // Utiliza el transporter configurado para enviar el correo
        const info = await transporter.sendMail({
            from: config.EMAIL_USER, // Correo del remitente
            to,                      // Correo del destinatario
            subject,                 // Asunto del correo
            html,                    // Contenido HTML del correo
        });
        console.log('Email enviado: ', info.messageId); // Log del ID del mensaje enviado
    } catch (error) {
        console.error('Error al enviar email: ', error); // Captura y muestra errores en el envío
    }
};

// Función para enviar correo electrónico de restablecimiento de contraseña
export const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        // Crea un nuevo transporter para enviar el correo de restablecimiento de contraseña
        const transporter = nodemailer.createTransport({
            service: "Gmail", // Utiliza Gmail como proveedor de servicios
            auth: {
                user: config.EMAIL_USER,  // Usuario de Gmail (remitente)
                pass: config.EMAIL_PASS   // Contraseña de la cuenta de Gmail
            }
        });

        // Configuración del correo a enviar
        const mailOptions = {
            to: email,                    // Destinatario
            from: config.EMAIL_USER,      // Remitente
            subject: "Restablecimiento de contraseña", // Asunto del correo
            text: `Estás recibiendo este correo porque tú (o alguien más) ha solicitado restablecer la contraseña de tu cuenta.\n\n
                Por favor, haz clic en el siguiente enlace o cópialo y pégalo en tu navegador para completar el proceso:\n\n
                ${resetUrl}\n\n
                Si no solicitaste este cambio, por favor ignora este correo y tu contraseña permanecerá igual.\n`
        };

        // Envía el correo electrónico de restablecimiento
        await transporter.sendMail(mailOptions);
        console.log('Correo de restablecimiento de contraseña enviado a: ', email);
    } catch (error) {
        console.error("Error enviando el correo de restablecimiento: ", error); // Manejo de errores en el envío
    }
};
