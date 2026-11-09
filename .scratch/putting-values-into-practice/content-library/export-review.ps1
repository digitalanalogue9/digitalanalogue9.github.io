$ErrorActionPreference = 'Stop'

$cataloguePath = Join-Path $PSScriptRoot 'library.json'
$catalogue = Get-Content -LiteralPath $cataloguePath -Raw | ConvertFrom-Json
$repositoryPath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$valueTitles = @{}

foreach ($valueSet in @('personal', 'team')) {
    $relativePath = if ($valueSet -eq 'personal') { 'src/data/values.json' } else { 'src/data/team-values.json' }
    $sourcePath = Join-Path $repositoryPath $relativePath
    foreach ($value in (Get-Content -LiteralPath $sourcePath -Raw | ConvertFrom-Json).values) {
        $valueTitles[$valueSet + ':' + $value.id] = $value.title
    }
}

$review = [System.Collections.Generic.List[string]]::new()
$review.Add('# Content library: reading copy')
$review.Add('')
$review.Add('Generated from [library.json](library.json). Edit that file, then run [export-review.ps1](export-review.ps1) to refresh this view and the [value coverage report](value-coverage.md). Content version: ' + $catalogue.contentVersion + '. Status: editorial draft.')
$review.Add('')
$review.Add('Every situation asks: **' + $catalogue.sharedPrompts.response + '** It then asks: **' + $catalogue.sharedPrompts.motivation + '** Also offer a response in the person''s own words, skipping, an optional value connection and an optional real example. Editorial notes and value-relevance reasons below are for author review.')
$review.Add('')

$usedValues = @{}
foreach ($context in $catalogue.contexts) {
    $review.Add('## ' + $context.label)
    $review.Add('')
    foreach ($area in $catalogue.areas) {
        $review.Add('### ' + $area.label)
        $review.Add('')
        foreach ($situation in $catalogue.scenarios | Where-Object { $_.contextId -eq $context.id -and $_.areaId -eq $area.id }) {
            $review.Add('#### ' + $situation.title)
            $review.Add('')
            $review.Add('ID: `' + $situation.id + '`')
            $review.Add('')
            $review.Add($situation.situation)
            $review.Add('')
            foreach ($response in $situation.responseOptions) { $review.Add('- ' + $response.label) }
            $review.Add('')
            $review.Add('**Value relevance — suggestions for exploration:**')
            $review.Add('')
            foreach ($link in $situation.valueLinks) {
                $valueKey = $link.set + ':' + $link.valueId
                if (-not $valueTitles.ContainsKey($valueKey)) { throw "Unknown value reference $valueKey in $($situation.id)" }
                $usedValues[$valueKey] = $true
                $review.Add('- **' + $valueTitles[$valueKey] + '** (`' + $valueKey + '`): ' + $link.reason)
            }
            $review.Add('')
            $review.Add('**Editorial note:** ' + $situation.editorialNote)
            $review.Add('')
        }
    }
}

$review.Add('## Optional examples for later reflection')
$review.Add('')
$review.Add('These support the shared deeper prompts; they must not be assigned as conclusions about a person.')
$review.Add('')
foreach ($area in $catalogue.areas) {
    $review.Add('### ' + $area.label)
    $review.Add('')
    $review.Add('**Where this could help:** ' + $area.helpfulExample)
    $review.Add('')
    $review.Add('**A possible cost:** ' + $area.possibleCostExample)
    $review.Add('')
    $review.Add('**Possible perspectives:** ' + $area.possiblePerspectiveExample)
    $review.Add('')
    $review.Add('**Actions someone could choose:**')
    $review.Add('')
    foreach ($action in $area.actionExamples) { $review.Add('- ' + $action) }
    $review.Add('')
}

$coverage = [System.Collections.Generic.List[string]]::new()
$coverage.Add('# Value relevance coverage')
$coverage.Add('')
$coverage.Add('Generated from [library.json](library.json) and the current personal/team value catalogues. These counts describe editorial links, not an assessment result or evidence of behavioural coverage.')
$coverage.Add('')
$coverage.Add('Situations: **' + $catalogue.scenarios.Count + '**. Curated value links: **' + @($catalogue.scenarios.valueLinks).Count + '**. Catalogue values with at least one link: **' + $usedValues.Count + ' of ' + $valueTitles.Count + '**.')
$coverage.Add('')
$coverage.Add('## Coverage by life context and area')
$coverage.Add('')
$coverage.Add('| Context | Area | Situations |')
$coverage.Add('| --- | --- | --- |')
foreach ($context in $catalogue.contexts) {
    foreach ($area in $catalogue.areas) {
        $count = @($catalogue.scenarios | Where-Object { $_.contextId -eq $context.id -and $_.areaId -eq $area.id }).Count
        $coverage.Add('| ' + $context.label + ' | ' + $area.label + ' | ' + $count + ' |')
    }
}
$coverage.Add('')
$coverage.Add('## Values with no curated links yet')
$coverage.Add('')
$coverage.Add('Use context-and-area selection when a chosen value has no curated match. Do not infer a mapping from the title or force a weak link. Further authoring may extend the library where these values are useful to explore.')
$coverage.Add('')
$coverage.Add('| Value reference | Current title |')
$coverage.Add('| --- | --- |')
foreach ($valueKey in $valueTitles.Keys | Sort-Object) {
    if (-not $usedValues.ContainsKey($valueKey)) { $coverage.Add('| `' + $valueKey + '` | ' + $valueTitles[$valueKey] + ' |') }
}
$coverage.Add('')
$coverage.Add('## Linked values by situation')
$coverage.Add('')
$coverage.Add('| Situation | Linked values |')
$coverage.Add('| --- | --- |')
foreach ($situation in $catalogue.scenarios) {
    $labels = foreach ($link in $situation.valueLinks) {
        $key = $link.set + ':' + $link.valueId
        $valueTitles[$key] + ' (' + $key + ')'
    }
    $coverage.Add('| `' + $situation.id + '` | ' + ($labels -join '; ') + ' |')
}

Set-Content -LiteralPath (Join-Path $PSScriptRoot 'review.md') -Value (($review -join [Environment]::NewLine).TrimEnd()) -Encoding utf8
Set-Content -LiteralPath (Join-Path $PSScriptRoot 'value-coverage.md') -Value (($coverage -join [Environment]::NewLine).TrimEnd()) -Encoding utf8
Write-Output ('Exported ' + $catalogue.scenarios.Count + ' situations; ' + $usedValues.Count + ' of ' + $valueTitles.Count + ' catalogue values have curated links.')
