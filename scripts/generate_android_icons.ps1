Add-Type -AssemblyName System.Drawing

$sourcePath = "$PSScriptRoot\..\assets\images\logo.png"
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source logo not found at $sourcePath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($sourcePath)

function Resize-Image($img, $width, $height, $outPath, $padRatio = 0.0) {
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $destW = $width * (1.0 - $padRatio)
    $destH = $height * (1.0 - $padRatio)
    $destX = ($width - $destW) / 2.0
    $destY = ($height - $destH) / 2.0

    $g.DrawImage($img, [float]$destX, [float]$destY, [float]$destW, [float]$destH)
    $g.Dispose()

    $dir = Split-Path $outPath -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $outPath ($width x $height)"
}

$resDir = "$PSScriptRoot\..\android\app\src\main\res"

$sizes = @(
    @{ Name = "mipmap-mdpi"; Full = 48; Fore = 108 },
    @{ Name = "mipmap-hdpi"; Full = 72; Fore = 162 },
    @{ Name = "mipmap-xhdpi"; Full = 96; Fore = 216 },
    @{ Name = "mipmap-xxhdpi"; Full = 144; Fore = 324 },
    @{ Name = "mipmap-xxxhdpi"; Full = 192; Fore = 432 }
)

foreach ($s in $sizes) {
    $folder = Join-Path $resDir $s.Name
    # Full icon (square and round)
    Resize-Image $srcImg $s.Full $s.Full (Join-Path $folder "ic_launcher.png") 0.05
    Resize-Image $srcImg $s.Full $s.Full (Join-Path $folder "ic_launcher_round.png") 0.05
    # Foreground adaptive icon (padded by ~25% as per Android adaptive icon guidelines)
    Resize-Image $srcImg $s.Fore $s.Fore (Join-Path $folder "ic_launcher_foreground.png") 0.25
}

# Also update splash screen drawable
$splashDrawables = @("drawable", "drawable-port-hdpi", "drawable-port-mdpi", "drawable-port-xhdpi", "drawable-port-xxhdpi", "drawable-port-xxxhdpi")
foreach ($d in $splashDrawables) {
    $dFolder = Join-Path $resDir $d
    if (Test-Path $dFolder) {
        Resize-Image $srcImg 480 480 (Join-Path $dFolder "splash.png") 0.2
    }
}

$srcImg.Dispose()
Write-Host "All Android icons generated successfully from NITHYA logo!"
