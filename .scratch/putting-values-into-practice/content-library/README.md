# Content library

The agreed library structure is **48 situations: four life contexts × six reflection areas × two situations**. The [session and selection plan](../content-plan.md) is accepted. The complete content and its value mappings are an editorial draft; the original four-situation example was reviewed before expansion.

## Files

| File | Purpose |
| --- | --- |
| [library.json](library.json) | Authoritative situation content, response options, shared prompts, optional area examples and value-relevance links. |
| [library.schema.json](library.schema.json) | JSON Schema describing the authoring format. |
| [review.md](review.md) | Generated reading copy of all 48 situations, with linked value titles and reasons. |
| [value-coverage.md](value-coverage.md) | Generated coverage report, including values without curated links. |
| [relationships-pilot.md](relationships-pilot.md) | The original four-situation session as a reading sequence in the complete library. |
| [export-review.ps1](export-review.ps1) | Regenerates the reading copy and coverage report from the JSON and current value catalogues. |

## Content structure

The library separates life contexts, reflection areas, shared prompts and situations. Each situation has a stable ID, a context ID, a primary area ID, a title, situation text, three response options, value links and an editorial note. Editorial notes are for authors; they are not conclusions to show to a participant.

Each response option has its own stable ID. Preserve the ID when changing its display order or making a wording edit that preserves its meaning. Neither an option's ID nor its position encodes a score or preferred answer. “Something else” and skipping are shared interaction affordances, not additional authored options in every record.

The shared motivation and optional value/example prompts apply to every situation. Area examples support the later reflection and must remain optional possibilities. They do not automatically describe someone who answered a situation in that area.

## Linking values

Use the existing value IDs together with their source set:

```json
{
  "set": "personal",
  "valueId": "16",
  "reason": "Explore how you express a preference in a group."
}
```

This references **COMMUNICATION** in the [personal catalogue](../../../src/data/values.json). The same numeric ID in the [team-focused catalogue](../../../src/data/team-values.json) means something different. Match using both `set` and `valueId`, never the numeric ID or title alone.

Links belong to the **situation**, and mean that the situation could be useful for exploring the linked value. Each includes a reason for editorial review. A situation may link to several values from either set; a value may link to many situations. No link determines which response is value-aligned or what motivation the person has.

Value titles and descriptions remain in the existing catalogues. The JSON references their IDs; the generated review resolves their current titles so the content does not maintain a second authoritative copy of the values.

## Optional value-guided selection

When saved values are available, offer to use them to suggest relevant situations. If the person opts in, match the source set and value ID to these curated links. Explain the relevance using the reason, retain the four-situation/two-area structure, and let the person change the suggestions. Offer the other situation in each selected area as a comparison even when it does not share the same value link.

The person still chooses whether a particular response connects to a value afterwards. Selection relevance and a personal value connection are different things.

If there is no curated match within the chosen context, say so and offer ordinary context-and-area selection. The initial library does not cover every value. A manually named or custom value also needs this fallback unless a curated mapping is added. Do not silently guess from its title or treat a missing link as a judgement about the value.

This authoring format provides the data for suggestions. The ranking or tie-breaking algorithm and integration with saved exercises are follow-up implementation work. It does not require an AI service.

## Editing and review

1. Edit `library.json` as the authoritative source. Keep existing IDs stable and update the content version for meaningful changes.
2. Check the format against `library.schema.json`. Also check unique situation and response IDs, valid context/area references, two situations per context/area, and valid value references; JSON Schema alone cannot enforce all those relationships.
3. From the repository root, run:

   ```powershell
   & .scratch/putting-values-into-practice/content-library/export-review.ps1
   ```

4. Review the regenerated reading copy for plausible alternatives, distinct situations within each pair and defensible value relevance. Check the coverage report for gaps rather than stretching a link to fill them.

The content follows the [source notes](../source-notes.md) and [evidence rules](../spec.md#summary-and-evidence-rules). A shared area or linked value is not evidence of a recurring behavioural theme.
