import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  nombre: string;
  verificationUrl: string;
}

export const VerificationEmail = ({
  nombre,
  verificationUrl,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verifica tu correo electrónico en UniversIA</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Bienvenido a UniversIA 🎓</Heading>
        
        <Text style={text}>Hola {nombre},</Text>
        
        <Text style={text}>
          Gracias por registrarte en UniversIA, la plataforma educativa 100% impulsada por Inteligencia Artificial.
        </Text>
        
        <Text style={text}>
          Para completar tu registro y comenzar a aprender, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:
        </Text>
        
        <Section style={buttonContainer}>
          <Button style={button} href={verificationUrl}>
            Verificar Email
          </Button>
        </Section>
        
        <Text style={text}>
          Si no creaste una cuenta en UniversIA, puedes ignorar este mensaje.
        </Text>
        
        <Text style={footer}>
          Este link expira en 24 horas.
        </Text>
        
        <Text style={footer}>
          © 2025 UniversIA - Educación impulsada por IA
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 20px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "16px 20px",
  textAlign: "center" as const,
};
