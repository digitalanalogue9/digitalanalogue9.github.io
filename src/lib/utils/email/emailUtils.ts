import { Value, ValueWithReason } from '@/lib/types';
export function generateEmailContent(values: ValueWithReason[]): string {
  const emailSubject = 'My Core Values Results';
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">My Core Values</h1>
        <p>Here are my selected core values and their significance:</p>
        ${values
          .map(
            (value) => `
          <div style="margin-bottom: 20px; padding: 15px; background-color: #fef9c3; border-radius: 8px;">
            <h2 style="margin: 0; color: #1f2937; font-size: 18px;">${value.title}</h2>
            <p style="margin: 8px 0; color: #4b5563;">${value.description}</p>
            ${
              value.reason
                ? `
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #d1d5db;">
                <p style="margin: 0; font-style: italic; color: #4b5563;">
                  <strong>Why it's meaningful:</strong> ${value.reason}
                </p>
              </div>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </body>
    </html>
  `;

  // Remove any newlines and extra spaces to make the mailto link cleaner
  const cleanHtmlContent = htmlContent.replace(/\s+/g, ' ').trim();

  // Create the mailto link
  const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(cleanHtmlContent)}`;
  return mailtoLink;
}
export function shareViaEmail(values: Value[]) {
  const mailtoLink = generateEmailContent(values);
  window.location.href = mailtoLink;
}
