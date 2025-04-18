import os
import uuid
import torch
import clip
import pandas as pd
from PIL import Image

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Helper to get CLIP prediction
def get_clip_prediction(image_path, text_options):
    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
    text = clip.tokenize(text_options).to(device)

    with torch.no_grad():
        logits_per_image, _ = model(image, text)
        probs = logits_per_image.softmax(dim=-1).cpu().numpy()

    best_idx = probs[0].argmax()
    return text_options[best_idx]

# Main function
def store_products(folder_path, userID, cache_enabled=True):
    # Create folders if they don't exist
    os.makedirs("wardboards", exist_ok=True)
    os.makedirs("wardpaths", exist_ok=True)

    # File paths
    wardboard_path = f"wardboards/Wardboard_{userID}.csv"
    wardpath_path = f"wardpaths/Wardpath_{userID}.csv"
    processed_cache_path = f"wardboards/processed_{userID}.txt"

    # Load previously processed files
    processed_files = set()
    if cache_enabled and os.path.exists(processed_cache_path):
        with open(processed_cache_path, "r") as f:
            processed_files = set(f.read().splitlines())

    # Define columns
    columns = [
        'productID', 'productDisplayName', 'ageGroup', 'gender',
        'baseColour', 'fashionType', 'season', 'usage',
        'displayCategories', 'typeName', 'description', 'TopOrBottom', 'Fit',
        'Sleeve Length', 'Fabric', 'brandName'
    ]

    # Prepare DataFrames
    wardboard = pd.DataFrame(columns=columns)
    wardpath = pd.DataFrame(columns=['productID', 'imagePath'])

    # Get image files
    files = sorted([f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    processed_flags = [f in processed_files for f in files]

    for i, filename in enumerate(files):
        if processed_flags[i]:
            print(f"Skipping already processed: {filename}")
            continue

        path = os.path.join(folder_path, filename)
        productID = str(uuid.uuid4())[:8]

        print(f"Processing: {filename}")

        # Predict using CLIP
        ageGroup = get_clip_prediction(path, ["Kids", "Teens", "Adults"])
        gender = get_clip_prediction(path, ["Male", "Female", "Unisex"])
        baseColour = get_clip_prediction(path, [
            "Red", "Blue", "Black", "White", "Green",
            "Yellow", "Pink", "Orange", "Purple", "Brown"
        ])
        description = get_clip_prediction(path, [
            "A casual shirt", "A formal outfit", "A sporty outfit",
            "Denim jeans", "Traditional wear", "A jacket",
            "A simple T-shirt", "A pair of trousers"
        ])
        top_or_bottom = get_clip_prediction(path, ["Topwear", "Bottomwear"])

        # Construct data row
        product_data = {
            'productID': productID,
            'productDisplayName': filename,
            'ageGroup': ageGroup,
            'gender': gender,
            'baseColour': baseColour,
            'fashionType': 'Fashion',
            'season': 'All Seasons',
            'usage': 'Casual',
            'displayCategories': 'Wardrobe',
            'typeName': top_or_bottom,
            'description': description,
            'TopOrBottom': top_or_bottom,
            'Fit': 'Regular Fit',
            'Sleeve Length': 'Normal',
            'Fabric': 'Normal',
            'brandName': 'Generic'
        }

        # Append to DataFrames
        wardboard.loc[len(wardboard)] = product_data
        wardpath.loc[len(wardpath)] = {'productID': productID, 'imagePath': path}

        # Save to cache
        if cache_enabled:
            with open(processed_cache_path, "a") as f:
                f.write(filename + "\n")

    # Save CSVs
    wardboard.to_csv(wardboard_path, index=False)
    wardpath.to_csv(wardpath_path, index=False)

    return {
        "wardboard_csv": wardboard_path,
        "wardpath_csv": wardpath_path,
        "processed_flags": processed_flags
    }

user_id = 37
# Example usage
store_products("./demo/", user_id)