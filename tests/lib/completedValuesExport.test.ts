import { describe, expect, it } from 'vitest';
import { buildCompletedValuesHtml } from '@/lib/utils/completedValuesExport';

describe('completed values HTML export', () => {
  it('embeds the artwork and fonts for an offline document while escaping personal content', () => {
    const html = buildCompletedValuesHtml('ref<1', {
      completedAt: 123,
      finalValues: [{ id: 'care', title: 'Care & kindness', description: '', reason: '<private>' }],
    });

    expect(html).toContain('data:image/svg+xml,');
    expect(html).toContain('data:font/woff2;base64,');
    expect(html).toContain("font-family: 'DM Sans'");
    expect(html).toContain("font-family: 'Source Serif 4'");
    expect(html).toContain('Care &amp; kindness');
    expect(html).toContain('&lt;private&gt;');
    expect(html).toContain('ref&lt;1');
    expect(html).not.toContain('Completed by');
  });
});
