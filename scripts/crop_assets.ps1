Add-Type -AssemblyName System.Drawing
$srcPath = 'C:\Users\acer\.gemini\antigravity\brain\56f62506-da3e-42f6-abfd-03ebe0644bcf\.user_uploaded\media_1792646705087_1e23f374.jpg'
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-Image($x, $y, $w, $h, $dest) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $crop = $img.Clone($rect, $img.PixelFormat)
    $crop.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
    Write-Host "Saved $dest"
}

# Avatar & Character
Crop-Image 22 45 115 120 'assets\images\pastel\sidebar_avatar_3d.png'
Crop-Image 195 110 165 180 'assets\images\pastel\hero_girl_3d.png'
Crop-Image 590 140 105 145 'assets\images\pastel\potted_plant_3d.png'
Crop-Image 48 718 64 50 'assets\images\pastel\crown_3d.png'
Crop-Image 188 892 78 78 'assets\images\pastel\star_3d.png'
Crop-Image 460 695 230 150 'assets\images\pastel\daily_mix_room.png'

# 4 Stat Icons
Crop-Image 202 320 28 28 'assets\images\pastel\icon_music_3d.png'
Crop-Image 338 320 28 28 'assets\images\pastel\icon_heart_3d.png'
Crop-Image 474 320 28 28 'assets\images\pastel\icon_clock_3d.png'
Crop-Image 610 320 28 28 'assets\images\pastel\icon_flame_3d.png'

# Recently Practiced / Played thumbs
Crop-Image 188 698 46 44 'assets\images\pastel\thumb_sunset.png'
Crop-Image 188 756 46 44 'assets\images\pastel\thumb_golden.png'
Crop-Image 188 812 46 44 'assets\images\pastel\thumb_coffee.png'

$img.Dispose()
Write-Host "All icons and thumbnails cropped successfully!"
