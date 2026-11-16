import type { CompletedSession } from '@/lib/contracts/types';
import backgroundSvg from '../../../public/images/core-values-error-bg.svg?raw';
import headingFont from '../../../public/fonts/dm-sans-latin-600-normal.woff2?inline';
import bodyFont from '../../../public/fonts/source-serif-4-latin-400-normal.woff2?inline';
import interfaceFont from '../../../public/fonts/source-sans-3-latin-600-normal.woff2?inline';

type ClipboardWriter = {
  writeText: (text: string) => Promise<void>;
};

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function formatCompletedAt(completedAt: number): string {
  return new Date(completedAt).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getCompletedBy(completedSession: CompletedSession): string {
  return completedSession.completedBy?.trim() || 'unavailable';
}

export function normalizeCompletedValueReason(reason?: string): string {
  return reason?.trim() ?? '';
}

export function formatCompletedValuesText(sessionReference: string, completedSession: CompletedSession): string {
  const lines = [
    'Completed Values',
    `Session reference: ${sessionReference}`,
    `Completed: ${formatCompletedAt(completedSession.completedAt)}`,
    `Completed by: ${getCompletedBy(completedSession)}`,
    '',
  ];

  completedSession.finalValues.forEach((value, index) => {
    const reason = normalizeCompletedValueReason(value.reason);

    lines.push(`${index + 1}. ${value.title}`);
    if (reason) {
      lines.push(`Reason: ${reason}`);
    }
    lines.push('');
  });

  return lines.join('\n').trim();
}

export function buildCompletedValuesHtml(sessionReference: string, completedSession: CompletedSession): string {
  const completedAt = formatCompletedAt(completedSession.completedAt);
  const cardsMarkup = completedSession.finalValues
    .map((value, index) => {
      const reason = normalizeCompletedValueReason(value.reason);
      const reasonMarkup = reason ? `<p>${escapeHtml(reason)}</p>` : '';

      return `
        <li class="value-card">
          <div class="value-index">${index + 1}</div>
          <div>
            <h2>${escapeHtml(value.title)}</h2>
            ${reasonMarkup}
          </div>
        </li>
      `;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Completed Values - ${escapeHtml(sessionReference)}</title>
    <style>
      @font-face {
        font-family: 'DM Sans';
        src: url('${headingFont}') format('woff2');
        font-weight: 600;
      }
      @font-face {
        font-family: 'Source Serif 4';
        src: url('${bodyFont}') format('woff2');
        font-weight: 400;
      }
      @font-face {
        font-family: 'Source Sans 3';
        src: url('${interfaceFont}') format('woff2');
        font-weight: 600;
      }
      @page {
        margin: 12mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        background: #faf5f8 url('data:image/svg+xml,${encodeURIComponent(backgroundSvg)}') center / cover fixed no-repeat;
        color: #3c2a38;
        font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif;
        line-height: 1.5;
        margin: 0;
      }

      main {
        background: #faf5f8;
        border: 1px solid #d6bdcc;
        border-radius: 8px;
        margin: 24px auto;
        max-width: 896px;
        padding: clamp(24px, 5vw, 40px);
      }

      header {
        border-bottom: 1px solid #d6bdcc;
        display: grid;
        gap: 16px;
        grid-template-columns: 1fr auto;
        padding-bottom: 18px;
      }

      h1 {
        font-family: 'DM Sans', Arial, sans-serif;
        font-size: clamp(28px, 5vw, 40px);
        font-weight: 600;
        line-height: 1.15;
        margin: 0;
      }

      .stamp {
        align-self: start;
        border: 1px solid #d6bdcc;
        color: #613d60;
        font-family: 'Source Sans 3', Arial, sans-serif;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        padding: 8px 10px;
        text-transform: uppercase;
      }

      .meta {
        display: grid;
        gap: 8px 24px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin: 20px 0 24px;
      }

      .meta p {
        margin: 0;
      }

      .meta strong {
        display: block;
        font-family: 'Source Sans 3', Arial, sans-serif;
        font-weight: 600;
        font-size: 11px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      ol {
        display: grid;
        gap: 10px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .value-card {
        background: #ffffff;
        border: 1px solid #d6bdcc;
        border-radius: 8px;
        break-inside: avoid;
        display: grid;
        gap: 12px;
        grid-template-columns: auto 1fr;
        padding: 16px;
        page-break-inside: avoid;
      }

      .value-index {
        align-items: center;
        background: #613d60;
        border-radius: 50%;
        color: #ffffff;
        display: flex;
        font-family: 'Source Sans 3', Arial, sans-serif;
        font-weight: 600;
        height: 28px;
        justify-content: center;
        width: 28px;
      }

      h2 {
        font-family: 'DM Sans', Arial, sans-serif;
        font-weight: 600;
        font-size: 18px;
        margin: 0 0 4px;
      }

      .value-card p {
        font-size: 16px;
        margin: 0;
        overflow-wrap: anywhere;
      }

      @media (max-width: 600px) {
        main { margin: 12px; }
        header { grid-template-columns: 1fr; }
        .stamp { justify-self: start; }
        .meta { grid-template-columns: 1fr; }
      }

      @media print {
        body {
          background: #ffffff;
        }

        main {
          border: 0;
          margin: 0;
          max-width: none;
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>Completed Core Values</h1>
        <div class="stamp">Completed</div>
      </header>
      <section class="meta" aria-label="Completion details">
        <p><strong>Completed</strong>${escapeHtml(completedAt)}</p>
        <p><strong>Session reference</strong>${escapeHtml(sessionReference)}</p>
      </section>
      <ol>${cardsMarkup}</ol>
    </main>
  </body>
</html>`;
}

function fallbackCopyText(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', 'true');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const succeeded = document.execCommand('copy');
  document.body.removeChild(textArea);

  if (!succeeded) {
    throw new Error('Copy failed.');
  }
}

export async function copyCompletedValuesText(text: string) {
  const clipboard = navigator.clipboard as ClipboardWriter | undefined;

  if (clipboard?.writeText) {
    await clipboard.writeText(text);
    return;
  }

  fallbackCopyText(text);
}

export function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  // Let the browser start the download before releasing its object URL.
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
    anchor.remove();
  }, 1000);
}

export function downloadJsonFile(filename: string, payload: unknown) {
  downloadTextFile(`${filename}.json`, JSON.stringify(payload, null, 2), 'application/json');
}

export function downloadCompletedValuesHtml(sessionReference: string, completedSession: CompletedSession) {
  downloadTextFile(
    `core-values-${sessionReference}.html`,
    buildCompletedValuesHtml(sessionReference, completedSession),
    'text/html;charset=utf-8'
  );
}

export function printCompletedValues(sessionReference: string, completedSession: CompletedSession) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Print preview could not be opened.');
  }
  // Keep a reference for writing the print document, then sever access to its opener.
  // Opening with the noopener feature returns null in Chromium even when the popup opens.
  printWindow.opener = null;

  printWindow.document.write(buildCompletedValuesHtml(sessionReference, completedSession));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
