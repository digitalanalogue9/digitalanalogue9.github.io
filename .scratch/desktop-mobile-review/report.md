# Desktop and mobile review

Status: in progress — review incomplete

Base: `9e3c9e501e25134979f5512fe8363163cb9b39c6` (local main).

## Important verification correction

The initial browser and Playwright test runs targeted port 5173. A later process inspection identified its owner as a
Vite server from `C:\dev\github\values-flow-integration`, a different worktree. Those results, including the failed
`functional-pages.spec.ts:126` assertion, cannot be attributed to this branch. They must not be treated as verification
or as a confirmed defect on this branch. The other server was left running.

An explicitly bound Vite server from this worktree was then started on port 4178. In Chromium via Playwright MCP, the
skip link received focus on Tab and moved focus to `main-content` on Enter; Escape closed the mobile menu and returned
focus to its toggle at 390×844. At widths 320, 390, 768 and 1440, visits to `/`, `/howtouse`, `/about`, `/contact`,
`/privacy`, `/history`, `/exercise`, `/replay`, `/completed`, `/reasoning` and a missing route found no document-level
horizontal overflow. Lazy pages were allowed 250ms after navigation; this scan alone does not establish complete
loaded-state coverage, visual quality or absence of clipping within components.

## Findings and changes

| Severity | Finding                                                                                                                                                                                                                          | Resolution                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Medium   | Source inspection showed the mobile navigation had no Escape handling. `src/router.tsx`.                                                                                                                                         | Escape closes the menu and returns focus to its toggle; verified on this worktree at 390px and by a regression test.      |
| Medium   | Shared shell had no skip link, requiring keyboard users to traverse navigation on every page. `src/router.tsx`, `src/styles/editorial.css`.                                                                                      | Added a focus-visible skip link and a focusable main target. Verified on this worktree at 390px and by a regression test. |
| Decision | The guide shows instructions for a behaviour reflection reminder even with the behaviour route disabled; an existing test explicitly expects the section to remain visible when the link is absent. `src/personal/HelpPage.tsx`. | Left unchanged pending owner intent: should these instructions be visible before the feature is enabled?                  |

## Design and copy

`src/router.tsx` owns the shared shell and routes; `src/styles/editorial.css`, `src/styles/globals.css`, `src/cv/` and
feature styles define shared and feature treatments. Graphify's structural extraction of `src` produced 1,068 nodes and
3,142 edges; CSS was unclassified, so style relationships were checked in source. The design uses plum, rose and paper
surfaces, DM Sans headings, Source Serif 4 body text and Source Sans 3 interface text. `DESIGN.md` agrees with the
implemented heading and body families; `PRODUCT.md` contains no conflicting typography claim. No copy changes were made.

## Checks and limitations

`pnpm check` passed (typecheck, lint and unit tests), and `pnpm build` passed in this worktree. Seventeen Playwright
tests in the home, guide and routing files passed against port 4178 using a temporary config. Other automated Playwright
runs used the other server and need to be repeated against this worktree. A thorough visual review of this worktree,
copy sweep, populated history/results/reflection/replay, error and consent states, reduced motion, contrast, real touch
and mobile browser testing remain outstanding. The initial screenshots belong to the other server and are not valid
evidence for this branch. Do not treat this report as a complete audit.

The independent standards review of `9e3c9e5...30076a8` found no hard standards violations or material code smells. The
spec review found no verified implementation defect or scope creep, but confirmed that the requested site-wide review
and verification remain incomplete. The invalidated browser evidence makes that limitation wider than the reviewer could
assess.

Graphify generated `src/graphify-out/`; automatic policy rejected its recursive removal. That directory and the
untracked screenshots produced by the tests remain in the worktree and are not part of the commit.
