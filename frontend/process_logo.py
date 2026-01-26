
from PIL import Image
import sys

def convert_to_transparent(input_path, output_path):
    print(f"Processing {input_path}...")
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Check if the pixel is close to white (brightness > 200)
        # item is (r, g, b, a)
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            new_data.append((255, 255, 255, 0)) # Make it transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    convert_to_transparent("public/harbor-logo.png", "public/harbor-logo-fixed.png")
