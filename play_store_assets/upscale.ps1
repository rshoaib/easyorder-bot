
Add-Type -AssemblyName System.Drawing

$sourceDir = "c:\Projects\easyorder\play_store_assets"
$files = Get-ChildItem "$sourceDir\screenshot_tablet_*.png"

foreach ($file in $files) {
    Write-Host "Upscaling $($file.Name)..."
    
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    
    # Target size: 2048 x 1280 (Satisfies > 1080px requirement)
    $width = 2048
    $height = 1280
    
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graph = [System.Drawing.Graphics]::FromImage($bitmap)
    
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    
    $graph.DrawImage($img, 0, 0, $width, $height)
    
    $newPath = "$sourceDir\10inch_$($file.Name)"
    $bitmap.Save($newPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $img.Dispose()
    $bitmap.Dispose()
    $graph.Dispose()
    
    Write-Host "Created $newPath"
}
