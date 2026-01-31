from PIL import Image
import os

def make_transparent(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print(f"Processing {file_path}...")
    img = Image.open(file_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # If the pixel is white or very close to white, make it transparent
        # Threshold of 240 to catch near-white pixels too
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(file_path, "PNG")
    print(f"Saved {file_path}")

# Special handling for favicon.ico
def update_ico():
    print("Updating favicon.ico...")
    img = Image.open("public/favicon-32x32.png")
    img.save("public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Saved public/favicon.ico")

favicons = [
    "public/favicon-16x16.png",
    "public/favicon-32x32.png",
    "public/favicon-48x48.png",
    "public/favicon-192x192.png",
    "public/favicon-512x512.png",
    "public/favicon.png",
    "public/logo.png",
    "public/apple-touch-icon.png"
]

for favicon in favicons:
    make_transparent(favicon)

update_ico()
