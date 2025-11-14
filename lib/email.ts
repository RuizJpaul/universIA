import { Resend } from "resend";

// No inicializar Resend hasta que sea necesario
let resend: Resend | null = null;

function getResendInstance() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface SendVerificationEmailParams {
  email: string;
  nombre: string;
  token: string;
}

export async function sendVerificationEmail({
  email,
  nombre,
  token,
}: SendVerificationEmailParams) {
  // token es ahora un código de 6 dígitos
  
  try {
    // Verificar si Resend está configurado
    if (!process.env.RESEND_API_KEY || 
        process.env.RESEND_API_KEY === 'your_resend_api_key_here' ||
        process.env.RESEND_API_KEY.startsWith('re_123')) {
      console.log("⚠️ Resend no configurado. Código de verificación:", token);
      console.log("📧 Email destino:", email);
      console.log("👤 Nombre:", nombre);
      // No lanzar error, solo loggear
      return { success: false, message: "Email service not configured" };
    }

    const resendInstance = getResendInstance();
    if (!resendInstance) {
      console.log("⚠️ No se pudo crear instancia de Resend");
      return { success: false, message: "Email service not available" };
    }

    const { data, error } = await resendInstance.emails.send({
      from: "UniversIA <onboarding@universia.edu.pe>",
      to: email,
      subject: "Código de Verificación - UniversIA",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificación de Email - UniversIA</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
                  <tr>
                    <td align="center">
                      <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">
                        🎓 Bienvenido a UniversIA
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="color: #333; font-size: 16px; line-height: 24px;">
                        Hola <strong>${nombre}</strong>,
                      </p>
                      <p style="color: #333; font-size: 16px; line-height: 24px;">
                        Gracias por registrarte en <strong>UniversIA</strong>, la plataforma educativa 100% impulsada por Inteligencia Artificial.
                      </p>
                      <p style="color: #333; font-size: 16px; line-height: 24px;">
                        Para completar tu registro, usa el siguiente código de verificación:
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 30px 0;">
                      <div style="background-color: #f6f9fc; border: 2px dashed #5469d4; border-radius: 8px; padding: 20px; display: inline-block;">
                        <span style="font-size: 32px; font-weight: bold; color: #5469d4; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${token}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="color: #666; font-size: 14px; line-height: 20px; text-align: center;">
                        Ingresa este código en la página de verificación
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="color: #666; font-size: 14px; line-height: 20px;">
                        Si no creaste una cuenta en UniversIA, puedes ignorar este mensaje.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 40px; border-top: 1px solid #e0e0e0;">
                      <p style="color: #999; font-size: 12px; text-align: center; margin: 10px 0;">
                        Este código expira en 15 minutos.
                      </p>
                      <p style="color: #999; font-size: 12px; text-align: center; margin: 10px 0;">
                        © 2025 UniversIA - Educación impulsada por IA
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    
    if (error) {
      console.error("Error al enviar email:", error);
      return { success: false, message: error.message };
    }
    
    console.log("✅ Email de verificación enviado exitosamente");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error en sendVerificationEmail:", error);
    return { success: false, message: error?.message || "Error desconocido" };
  }
}

interface SendPasswordResetEmailParams {
  email: string;
  nombre: string;
  token: string;
}

export async function sendPasswordResetEmail({
  email,
  nombre,
  token,
}: SendPasswordResetEmailParams) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;
  
  try {
    // Verificar si Resend está configurado
    if (!process.env.RESEND_API_KEY || 
        process.env.RESEND_API_KEY === 'your_resend_api_key_here' ||
        process.env.RESEND_API_KEY.startsWith('re_123')) {
      console.log("⚠️ Resend no configurado. Link de reset:", resetUrl);
      console.log("📧 Email destino:", email);
      return { success: false, message: "Email service not configured" };
    }

    const resendInstance = getResendInstance();
    if (!resendInstance) {
      return { success: false, message: "Email service not available" };
    }

    const { data, error } = await resendInstance.emails.send({
      from: "UniversIA <noreply@universia.edu.pe>",
      to: email,
      subject: "Recuperación de Contraseña - UniversIA",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperación de Contraseña - UniversIA</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
                  <tr>
                    <td align="center">
                      <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">
                        🔐 Recuperación de Contraseña
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="color: #333; font-size: 16px; line-height: 24px;">
                        Hola <strong>${nombre}</strong>,
                      </p>
                      <p style="color: #333; font-size: 16px; line-height: 24px;">
                        Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>UniversIA</strong>.
                      </p>
                      <p style="color: #333; font-size: 16px; line-height: 24px;">
                        Haz clic en el siguiente botón para crear una nueva contraseña:
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 30px 0;">
                      <a href="${resetUrl}" 
                         style="background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                        Restablecer Contraseña
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="color: #666; font-size: 14px; line-height: 20px;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:
                      </p>
                      <p style="color: #dc2626; font-size: 14px; word-break: break-all;">
                        ${resetUrl}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="color: #dc2626; font-size: 14px; line-height: 20px; font-weight: bold;">
                        ⚠️ Si no solicitaste restablecer tu contraseña, ignora este mensaje y tu cuenta permanecerá segura.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 40px; border-top: 1px solid #e0e0e0;">
                      <p style="color: #999; font-size: 12px; text-align: center; margin: 10px 0;">
                        Este link expira en 1 hora.
                      </p>
                      <p style="color: #999; font-size: 12px; text-align: center; margin: 10px 0;">
                        © 2025 UniversIA - Educación impulsada por IA
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    
    if (error) {
      console.error("Error al enviar email de reset:", error);
      return { success: false, message: error.message };
    }
    
    console.log("✅ Email de recuperación enviado exitosamente");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error en sendPasswordResetEmail:", error);
    return { success: false, message: error?.message || "Error desconocido" };
  }
}
