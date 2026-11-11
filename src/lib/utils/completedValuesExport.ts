import type { CompletedSession } from '@/lib/contracts/types';

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
  const completedBy = getCompletedBy(completedSession);
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
      @page {
        margin: 12mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        background: #f7f5e6;
        color: #14363f;
        font-family: 'Source Sans 3', Arial, sans-serif;
        line-height: 1.45;
        margin: 0;
      }

      main {
        background: #ffffff;
        border: 1px solid rgba(51, 63, 72, 0.18);
        margin: 24px auto;
        max-width: 960px;
        padding: 32px;
      }

      header {
        border-bottom: 2px solid #00f2b6;
        display: grid;
        gap: 16px;
        grid-template-columns: 1fr auto;
        padding-bottom: 18px;
      }

      h1 {
        font-family: 'Source Sans 3', Arial;
        font-size: 32px;
        font-weight: 400;
        line-height: 1.15;
        margin: 0;
      }

      .stamp {
        border: 1px solid rgba(240, 70, 50, 0.55);
        color: #14363f;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        padding: 8px 10px;
        text-transform: uppercase;
      }

      .meta {
        display: grid;
        gap: 8px 24px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin: 20px 0 24px;
      }

      .meta p {
        margin: 0;
      }

      .meta strong {
        display: block;
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
        border: 1px solid rgba(51, 63, 72, 0.18);
        break-inside: avoid;
        display: grid;
        gap: 12px;
        grid-template-columns: auto 1fr;
        padding: 12px;
        page-break-inside: avoid;
      }

      .value-index {
        align-items: center;
        background: #14363f;
        color: #ffffff;
        display: flex;
        font-weight: 700;
        height: 28px;
        justify-content: center;
        width: 28px;
      }

      h2 {
        font-family: 'Source Sans 3', Arial;
        font-size: 18px;
        margin: 0 0 4px;
      }

      .value-card p {
        font-size: 13px;
        margin: 0;
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
        <p><strong>Completed by</strong>${escapeHtml(completedBy)}</p>
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
