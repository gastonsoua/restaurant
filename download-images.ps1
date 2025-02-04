$urls = @(
    @{
        url = 'https://images.unsplash.com/photo-1590577976322-3d2d6e2130d5?q=80&w=2070'
        file = 'public/hero-image.jpg'
    },
    @{
        url = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2036'
        file = 'public/couscous.jpg'
    },
    @{
        url = 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=1972'
        file = 'public/brik.jpg'
    },
    @{
        url = 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?q=80&w=1964'
        file = 'public/tajine.jpg'
    }
)

foreach ($item in $urls) {
    Write-Host "Downloading $($item.file)..."
    Invoke-WebRequest -Uri $item.url -OutFile $item.file
}
