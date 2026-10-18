Add-Type -AssemblyName System.Drawing
$imgPath = Resolve-Path "Wireframes\Group 37.png"
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath.Path)
$rect = New-Object System.Drawing.Rectangle(20, 14, 69, 61)
$crop = $bmp.Clone($rect, $bmp.PixelFormat)
$outPath = Resolve-Path "public\images\logos"
$crop.Save("$($outPath.Path)\dv-logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop.Dispose()
$bmp.Dispose()
Write-Host "DV logo trimmed cleanly"
