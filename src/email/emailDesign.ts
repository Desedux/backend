export function emailDesign(username: string, key: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Autenticação</title>
  <style>
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
      }

      body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #742727 0%, #5a1a1a 100%);
          padding: 40px 20px;
          min-height: 100vh;
      }

      .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .header {
          background: linear-gradient(135deg, #742727 0%, #5a1a1a 100%);
          padding: 40px 30px;
          text-align: center;
      }

      .logo {
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 10px;
          letter-spacing: -1px;
      }

      .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 15px;
          font-weight: 500;
      }

      .content {
          padding: 50px 40px;
          background-color: #ffffff;
      }

      .greeting {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
      }

      .username {
          color: #742727;
      }

      .intro-text {
          color: #4a5568;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 35px;
      }

      .code-box {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border: 3px dashed #742727;
          border-radius: 12px;
          padding: 35px 25px;
          text-align: center;
          margin: 35px 0;
      }

      .code-title {
          color: #718096;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 15px;
      }

      .verification-code {
          font-size: 42px;
          font-weight: 800;
          color: #742727;
          font-family: 'Courier New', Courier, monospace;
          letter-spacing: 8px;
          margin: 15px 0;
          text-shadow: 2px 2px 4px rgba(125, 31, 31, 0.1);
      }

      .expiry-note {
          color: #a0aec0;
          font-size: 13px;
          margin-top: 15px;
          font-style: italic;
      }

      .alert-box {
          background-color: #fff5f5;
          border-left: 5px solid #fc8181;
          padding: 20px;
          margin: 30px 0;
          border-radius: 6px;
      }

      .alert-title {
          color: #c53030;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
      }

      .alert-icon {
          margin-right: 8px;
          font-size: 18px;
      }

      .alert-text {
          color: #742a2a;
          font-size: 14px;
          line-height: 1.5;
      }

      .instructions {
          background-color: #f7fafc;
          padding: 25px;
          border-radius: 8px;
          margin: 30px 0;
      }

      .instructions-title {
          color: #2d3748;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 15px;
      }

      .instructions-list {
          color: #4a5568;
          font-size: 14px;
          line-height: 1.8;
          padding-left: 20px;
      }

      .instructions-list li {
          margin-bottom: 8px;
      }

      .closing-text {
          color: #718096;
          font-size: 15px;
          line-height: 1.6;
          margin-top: 30px;
      }

      .signature {
          color: #2d3748;
          font-weight: 600;
          margin-top: 25px;
      }

      .footer {
          background-color: #2d3748;
          padding: 35px 40px;
          text-align: center;
      }

      .footer-text {
          color: #a0aec0;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 15px;
      }

      .footer-links {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #4a5568;
      }

      .footer-link {
          color: #7D1F1F;
          text-decoration: none;
          margin: 0 12px;
          font-size: 13px;
          font-weight: 500;
          transition: color 0.3s ease;
      }

      .footer-link:hover {
          color: #5A1616;
      }

      .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
          margin: 30px 0;
      }

      @media (max-width: 600px) {
          body {
              padding: 20px 10px;
          }

          .email-wrapper {
              border-radius: 12px;
          }

          .header {
              padding: 30px 20px;
          }

          .content {
              padding: 35px 25px;
          }

          .verification-code {
              font-size: 32px;
              letter-spacing: 4px;
          }

          .footer {
              padding: 25px 20px;
          }

          .footer-link {
              display: block;
              margin: 10px 0;
          }
      }
  </style>
</head>
<body>
<div class="email-wrapper">
  <div class="header">
    <div class="logo">Desedux</div>
    <div class="subtitle">Sistema de Autenticação Segura</div>
  </div>

  <div class="content">
    <div class="greeting">
      Olá, <span class="username">${username}</span>!
    </div>

    <div class="intro-text">
      Recebemos uma solicitação para autenticar sua conta. Para continuar, utilize o código de verificação abaixo. Este código é único e foi gerado especialmente para você.
    </div>

    <div class="code-box">
      <div class="code-title">Seu Código de Verificação</div>
      <div class="verification-code">${key}</div>
      <div class="expiry-note">⏱️ Este código expira em 10 minutos</div>
    </div>

    <div class="alert-box">
      <div class="alert-title">
        <span class="alert-icon">⚠️</span>
        Importante - Segurança da Conta
      </div>
      <div class="alert-text">
        Nunca compartilhe este código com ninguém. Nossa equipe jamais solicitará este código por telefone, email ou mensagem. Se você não solicitou este código, ignore este email e considere alterar sua senha.
      </div>
    </div>

    <div class="instructions">
      <div class="instructions-title">📋 Como usar este código:</div>
      <ul class="instructions-list">
        <li>Copie o código de 6 dígitos acima</li>
        <li>Retorne à página de autenticação</li>
        <li>Cole ou digite o código no campo indicado</li>
        <li>Clique em "Verificar" para completar o processo</li>
      </ul>
    </div>

    <div class="divider"></div>

    <div class="closing-text">
      Se você não solicitou este código ou está tendo problemas para acessar sua conta, entre em contato com nossa equipe de suporte imediatamente.
    </div>

    <div class="signature">
      Atenciosamente,<br>
      Equipe de Segurança
    </div>
  </div>

  <div class="footer">
    <div class="footer-text">
      © 2025 Desedux. Todos os direitos reservados.
    </div>
    <div class="footer-text">
      Esta é uma mensagem automática, por favor não responda este email.
    </div>
  </div>
</div>
</body>
</html>`;
}
