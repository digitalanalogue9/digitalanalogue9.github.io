$searchPath = "src"
$pattern = "export\s+interface\s+\w+"

Write-Output "Scanning for interface definitions in $searchPath..."
Write-Output "----------------------------------------`n"

Get-ChildItem -Path $searchPath -Recurse -Include *.tsx,*.ts | 
Where-Object { $_.Name -ne "types.ts" } |
ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match $pattern) {
        Write-Output "File: $($_.FullName)"
        # Extract and display the interface definitions
        $matches = [regex]::Matches($content, "(?ms)export\s+interface\s+\w+[^{]*{[^}]*}")
        foreach ($match in $matches) {
            Write-Output "`nInterface found:"
            Write-Output $match.Value
            Write-Output "----------------------------------------"
        }
    }
}

Write-Output "`nScan complete."
