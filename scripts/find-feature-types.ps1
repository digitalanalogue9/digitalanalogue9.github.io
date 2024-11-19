$srcPath = "src/components/features"
$features = Get-ChildItem -Path $srcPath -Directory

foreach ($feature in $features) {
    Write-Output "`nAnalyzing feature: $($feature.Name)"
    
    # Check if types.ts exists
    $typesFile = Join-Path $feature.FullName "types.ts"
    if (Test-Path $typesFile) {
        Write-Output "✓ Has types.ts"
    } else {
        Write-Output "✗ No types.ts file"
    }
    
    # Find files with interface definitions
    Write-Output "`nSearching for interface definitions..."
    $files = Get-ChildItem -Path $feature.FullName -Recurse -Include *.ts,*.tsx |
        Where-Object { $_.Name -ne "types.ts" }
    
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        if ($content -match "export\s+interface\s+\w+") {
            Write-Output "`nFile with interfaces: $($file.FullName)"
            $matches = [regex]::Matches($content, "(?ms)export\s+interface\s+\w+[^{]*{[^}]*}")
            foreach ($match in $matches) {
                Write-Output "`nInterface found:"
                Write-Output $match.Value
            }
        }
    }
}
