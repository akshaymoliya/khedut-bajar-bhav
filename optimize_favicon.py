from PIL import Image
import os

def optimize_favicon():
    source_path = "public/favicon-512x512.png"
    target_16 = "public/favicon-16x16.png"
    target_ico = "public/favicon.ico"
    
    if not os.path.exists(source_path):
        print(f"Source file not found: {source_path}")
        return

    print(f"Resizing {source_path} to 16x16 for better clarity...")
    # Use LANCZOS (formerly ANTIALIAS) for high-quality downsampling
    img_512 = Image.open(source_path).convert("RGBA")
    
    # 1. Create optimized 16x16 PNG
    img_16 = img_512.resize((16, 16), Image.Resampling.LANCZOS)
    img_16.save(target_16, "PNG", optimize=True)
    print(f"Saved optimized {target_16}")

    # 2. Update favicon.ico with the new 16x16 and others
    img_32 = img_512.resize((32, 32), Image.Resampling.LANCZOS)
    img_48 = img_512.resize((48, 48), Image.Resampling.LANCZOS)
    
    print("Updating favicon.ico with multiple sizes...")
    img_32.save(target_ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"Saved updated {target_ico}")

if __name__ == "__main__":
    optimize_favicon()
