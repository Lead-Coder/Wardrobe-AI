import pandas as pd
import numpy as np
import json
from gensim.models import Word2Vec
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean
import colorsys
import requests
from gradio_client import Client, file
from PIL import Image
from IPython.display import display
import base64
from io import BytesIO

# ------------------------------
# STEP 1: Load and Preprocess CSV
# ------------------------------
def preprocess_product_data(csv_path):
    """
    Loads a CSV file, processes gender and other attributes for recommendation.
    """
    df = pd.read_csv(csv_path)
    df.drop(columns=["year"], inplace=True)
    
    # Set age_group based on the "ageGroup" column
    df['age_group'] = df['ageGroup'].apply(lambda x: 'Kids' if "Adults" not in str(x) else 'Adults')
    
    # Ensure we have gender information
    if 'gender' in df.columns:
        df.loc[df['gender'].str.contains('Women|Girls', na=False), 'gender'] = 'Female'
        df.loc[df['gender'].str.contains('Men|Boys', na=False), 'gender'] = 'Male'
    else:
        df['gender'] = 'Unisex'
    
    # Add a category for dresses (for female users)
    if 'typeName' in df.columns:
        df['is_dress'] = df['typeName'].str.contains('Dress|Gown', case=False, na=False)
    else:
        df['is_dress'] = False
    return df

# ------------------------------
# STEP 2: Split data by age, gender, and category
# ------------------------------
def split_data_by_criteria(df):
    """
    Splits the preprocessed dataframe into subsets based on age, gender, and clothing type.
    Returns a dictionary of dataframes.
    """
    result = {}
    
    # Split by age group
    for age in ['Adults', 'Kids']:
        age_df = df[df['age_group'] == age].copy()
        
        # Split by gender
        for gender in ['Male', 'Female', 'Unisex']:
            gender_df = age_df[(age_df['gender'] == gender) | (age_df['gender'] == 'Unisex')].copy()
            if not gender_df.empty:
                # Dresses (female only, or Unisex if available)
                if gender in ['Female', 'Unisex']:
                    dresses = gender_df[gender_df['is_dress'] == True].copy()
                    if not dresses.empty:
                        result[f"{age}_{gender}_Dress"] = dresses
                
                # Topwear
                topwear = gender_df[(gender_df['TopOrBottom'] == 'Topwear') & (gender_df['is_dress'] == False)].copy()
                if not topwear.empty:
                    result[f"{age}_{gender}_Topwear"] = topwear
                
                # Bottomwear
                bottomwear = gender_df[(gender_df['TopOrBottom'] == 'Bottomwear') & (gender_df['is_dress'] == False)].copy()
                if not bottomwear.empty:
                    result[f"{age}_{gender}_Bottomwear"] = bottomwear
    
    return result

# ------------------------------
# STEP 3: Enhanced Word2Vec with Occasion Awareness
# ------------------------------
def train_word2vec(df, vector_size=100):
    """
    Trains a Word2Vec model over the text tokens present in the dataframe.
    Adds occasion-specific tokens to enhance similarity scoring.
    """
    sentences = []
    
    for _, row in df.iterrows():
        tokens = []
        for col in df.columns:
            if col not in ['index', 'id', 'year']:
                tokens.append(str(row[col]))
        
        # Add extra tokens based on usage if available
        if 'usage' in df.columns and pd.notna(row['usage']):
            tokens.extend(str(row['usage']).split())
        
        sentences.append(tokens)
    
    model = Word2Vec(sentences, vector_size=vector_size, window=5, min_count=1, workers=4)
    return model

# ------------------------------
# STEP 4: Vectorize with Occasion Weighting
# ------------------------------
def vectorize_dataframe(df, model, occasion=None):
    """
    Convert each row into a vector by averaging the word embeddings.
    Optionally weight tokens related to the requested occasion more heavily.
    """
    vectors = []
    token_columns = [col for col in df.columns if col not in ['index', 'id', 'year']]
    
    occasion_keywords = {
        'Formal': ['formal', 'office', 'business', 'work', 'professional', 'elegant'],
        'Casual': ['casual', 'everyday', 'relaxed', 'comfortable', 'leisure'],
        'Party': ['party', 'celebration', 'festive', 'glamorous', 'trendy'],
        'Ethnic': ['ethnic', 'traditional', 'cultural', 'festival', 'heritage']
    }
    
    for _, row in df.iterrows():
        tokens = [str(row[col]) for col in token_columns]
        token_vecs = []
        token_weights = []
        
        for token in tokens:
            if token in model.wv:
                weight = 1.0  
                if occasion and occasion in occasion_keywords:
                    if any(keyword in token.lower() for keyword in occasion_keywords[occasion]):
                        weight = 2.0  
                token_vecs.append(model.wv[token])
                token_weights.append(weight)
        
        if token_vecs:
            weighted_vec = np.average(token_vecs, axis=0, weights=token_weights)
            vectors.append(weighted_vec)
        else:
            vectors.append(np.zeros(model.vector_size))
    
    return np.array(vectors)

# ------------------------------
# STEP 5: Enhanced Color Handling
# ------------------------------
def color_to_rgb(color):
    """
    Convert a color name to its corresponding RGB value.
    """
    color = color.lower()
    color_map = {
        'red': (255, 0, 0), 'green': (0, 255, 0), 'blue': (0, 0, 255),
        'yellow': (255, 255, 0), 'purple': (128, 0, 128), 'orange': (255, 165, 0),
        'pink': (255, 192, 203), 'brown': (139, 69, 19), 'black': (0, 0, 0),
        'white': (255, 255, 255), 'gray': (169, 169, 169), 'beige': (245, 245, 220),
        'navy': (0, 0, 128), 'teal': (0, 128, 128), 'maroon': (128, 0, 0),
        'olive': (128, 128, 0), 'silver': (192, 192, 192), 'lime': (0, 255, 0),
        'aqua': (0, 255, 255), 'fuchsia': (255, 0, 255), 'cream': (255, 253, 208),
        'khaki': (240, 230, 140), 'lavender': (230, 230, 250), 'turquoise': (64, 224, 208),
        'indigo': (75, 0, 130), 'violet': (238, 130, 238), 'gold': (255, 215, 0),
        'coral': (255, 127, 80), 'magenta': (255, 0, 255), 'cyan': (0, 255, 255),
        'ivory': (255, 255, 240), 'emerald': (80, 200, 120), 'burgundy': (128, 0, 32)
    }
    return color_map.get(color, (255, 255, 255))

def color_distance(c1, c2):
    """
    Computes the Euclidean distance between two RGB colors.
    """
    return euclidean(np.array(c1), np.array(c2))

def color_compatibility_score(color1_rgb, color2_rgb):
    """
    Calculate a compatibility score between two colors.
    Returns a value between 0-1 where higher means better compatibility.
    """
    def rgb_to_hsv(rgb):
        r, g, b = [x/255.0 for x in rgb]
        return colorsys.rgb_to_hsv(r, g, b)
    
    hsv1 = rgb_to_hsv(color1_rgb)
    hsv2 = rgb_to_hsv(color2_rgb)
    
    hue_diff = abs(hsv1[0] - hsv2[0])
    if hue_diff > 0.5:
        hue_diff = 1.0 - hue_diff
    
    complementary_score = 1.0 - abs(hue_diff - 0.5) * 2.0
    analogous_score = 1.0 - min(abs(hue_diff) * 10.0, 1.0)
    triadic_score = 1.0 - abs(hue_diff - 0.33) * 3.0        
    
    neutral_bonus = 0.3 if hsv1[1] < 0.2 or hsv2[1] < 0.2 else 0
    base_score = max(complementary_score, analogous_score, triadic_score) + neutral_bonus
    
    if (color1_rgb in [(0,0,0), (255,255,255)] or 
        color2_rgb in [(0,0,0), (255,255,255)]):
        base_score = max(base_score, 0.8)
    
    return min(max(base_score, 0.0), 1.0)

# ------------------------------
# STEP 6: Occasion-Specific Color Palettes
# ------------------------------
def load_color_palette(occasion, palette_path="color_palettes.json"):
    """
    Loads color palettes from a JSON file for the given occasion.
    """
    try:
        with open(palette_path, "r") as f:
            color_palettes = json.load(f)
        return [color_to_rgb(color) for color in color_palettes.get(occasion, [])]
    except (FileNotFoundError, json.JSONDecodeError):
        default_palettes = {
            'Formal': ['black', 'navy', 'gray', 'white', 'burgundy'],
            'Casual': ['blue', 'green', 'beige', 'gray', 'brown', 'red'],
            'Party': ['red', 'black', 'gold', 'silver', 'purple', 'pink'],
            'Ethnic': ['gold', 'red', 'green', 'orange', 'turquoise', 'purple']
        }
        return [color_to_rgb(color) for color in default_palettes.get(occasion, ['black', 'white', 'blue'])]

# ------------------------------
# STEP 7: Enhanced Scoring System for Outfit Recommendation
# ------------------------------
def calculate_outfit_score(item1_vec, item2_vec, item1_rgb, item2_rgb, 
                           user_pref_vec, weights, occasion, occasion_palette=None):
    """
    Calculate a comprehensive score for an outfit combination.
    """
    user_item1_sim = cosine_similarity([user_pref_vec], [item1_vec])[0][0]
    
    if item2_vec is not None:
        user_item2_sim = cosine_similarity([user_pref_vec], [item2_vec])[0][0]
        item_item_sim = cosine_similarity([item1_vec], [item2_vec])[0][0]
    else:
        user_item2_sim = 1.0
        item_item_sim = 1.0

    if item2_rgb is not None:
        color_sim = color_compatibility_score(item1_rgb, item2_rgb)
    else:
        if occasion_palette:
            color_matches = [1.0 / (1.0 + color_distance(item1_rgb, pal_rgb))
                             for pal_rgb in occasion_palette]
            color_sim = max(color_matches) if color_matches else 0.5
        else:
            color_sim = 0.5
    
    if item2_vec is not None:  # Two-piece outfit
        final_score = (
            weights["user_match"] * ((user_item1_sim + user_item2_sim) / 2) +
            weights["item_compatibility"] * item_item_sim +
            weights["color_match"] * color_sim
        )
    else:  # Dress
        final_score = (
            weights["user_match"] * user_item1_sim +
            weights["color_match"] * color_sim
        )
    
    return final_score

# ------------------------------
# STEP 8: Recommendation Function
# ------------------------------
def recommend_outfit(user_preferences, data_splits, item_vectors, item_colors, 
                     w2v_model, palette_path="color_palettes.json"):
    """
    Recommend the best outfit based on user preferences.
    Returns a sorted list of recommendations.
    """
    age_group = user_preferences.get('age_group', 'Adults')
    gender = user_preferences.get('gender', 'Female')
    occasion = user_preferences.get('occasion', 'Casual')
    wear_type = user_preferences.get('wear_type', 'Two-piece')
    keywords = user_preferences.get('keywords', [])
    
    topwear_color = user_preferences.get('topwear_color', None)
    bottomwear_color = user_preferences.get('bottomwear_color', None)
    dress_color = user_preferences.get('dress_color', None)
    
    user_keywords = " ".join(keywords)
    if not user_keywords.strip():
        user_keywords = f"{occasion} {gender} {age_group}"
    if wear_type == 'Two-piece':
        if topwear_color:
            user_keywords += f" {topwear_color} top"
        if bottomwear_color:
            user_keywords += f" {bottomwear_color} bottom"
    else:
        if dress_color:
            user_keywords += f" {dress_color} dress"
    
    user_tokens = user_keywords.lower().split()
    user_vecs = [w2v_model.wv[token] for token in user_tokens if token in w2v_model.wv]
    user_pref_vec = np.mean(user_vecs, axis=0) if user_vecs else np.zeros(w2v_model.vector_size)
    
    occasion_palette = load_color_palette(occasion, palette_path)
    
    weights = {
        "user_match": 0.4,
        "item_compatibility": 0.3,
        "color_match": 0.3
    }
    
    recommendations = []
    
    if wear_type == 'Dress' and gender == 'Female':
        dress_key = f"{age_group}_{gender}_Dress"
        if dress_key in data_splits and not data_splits[dress_key].empty:
            dress_df = data_splits[dress_key]
            dress_vectors = item_vectors.get(dress_key, [])
            dress_colors = item_colors.get(dress_key, [])
            
            for i, dress_vec in enumerate(dress_vectors):
                if i < len(dress_colors):
                    dress_rgb = dress_colors[i]
                    color_boost = 0
                    if dress_color and dress_color.lower() in str(dress_df.iloc[i]['baseColour']).lower():
                        color_boost = 0.2
                    
                    score = calculate_outfit_score(
                        dress_vec, None, dress_rgb, None,
                        user_pref_vec, weights, occasion, occasion_palette
                    ) + color_boost

                    recommendations.append({
                        'type': 'Dress',
                        'dress': dress_df.iloc[i],
                        'dress_index': i,
                        'score': score
                    })
    elif wear_type == 'Two-piece':
        top_key = f"{age_group}_{gender}_Topwear"
        bottom_key = f"{age_group}_{gender}_Bottomwear"
        if (top_key in data_splits and not data_splits[top_key].empty and
            bottom_key in data_splits and not data_splits[bottom_key].empty):
            
            top_df = data_splits[top_key]
            bottom_df = data_splits[bottom_key]
            top_vectors = item_vectors.get(top_key, [])
            bottom_vectors = item_vectors.get(bottom_key, [])
            top_colors = item_colors.get(top_key, [])
            bottom_colors = item_colors.get(bottom_key, [])
            
            top_matches = []
            for i, top_vec in enumerate(top_vectors):
                if i < len(top_colors):
                    user_top_sim = cosine_similarity([user_pref_vec], [top_vec])[0][0]
                    if topwear_color and topwear_color.lower() in str(top_df.iloc[i]['baseColour']).lower():
                        user_top_sim += 0.2
                    top_matches.append((i, user_top_sim))
            
            bottom_matches = []
            for i, bottom_vec in enumerate(bottom_vectors):
                if i < len(bottom_colors):
                    user_bottom_sim = cosine_similarity([user_pref_vec], [bottom_vec])[0][0]
                    if bottomwear_color and bottomwear_color.lower() in str(bottom_df.iloc[i]['baseColour']).lower():
                        user_bottom_sim += 0.2
                    bottom_matches.append((i, user_bottom_sim))
            
            top_matches.sort(key=lambda x: x[1], reverse=True)
            bottom_matches.sort(key=lambda x: x[1], reverse=True)
            
            top_candidates = top_matches[:min(10, len(top_matches))]
            bottom_candidates = bottom_matches[:min(10, len(bottom_matches))]
            
            for top_idx, _ in top_candidates:
                for bottom_idx, _ in bottom_candidates:
                    if top_idx < len(top_vectors) and bottom_idx < len(bottom_vectors):
                        top_vec = top_vectors[top_idx]
                        bottom_vec = bottom_vectors[bottom_idx]
                        if top_idx < len(top_colors) and bottom_idx < len(bottom_colors):
                            top_rgb = top_colors[top_idx]
                            bottom_rgb = bottom_colors[bottom_idx]
                            
                            score = calculate_outfit_score(
                                top_vec, bottom_vec, top_rgb, bottom_rgb,
                                user_pref_vec, weights, occasion, occasion_palette
                            )
                            
                            recommendations.append({
                                'type': 'Two-piece',
                                'top': top_df.iloc[top_idx],
                                'bottom': bottom_df.iloc[bottom_idx],
                                'top_index': top_idx,
                                'bottom_index': bottom_idx,
                                'score': score
                            })
    # Sort recommendations by score (highest first) and return the top ones (e.g., top 11)
    recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)[:11]
    return recommendations

# ------------------------------
# STEP 9: Helper functions for try-on calls
# ------------------------------
def call_tryon_API(client_name, garment_img_path, user_img_path, extra_params, api_endpoint):
    """
    Calls the try-on API using the Gradio Client.
    Returns a list of result image file paths.
    """
    client = Client(client_name)
    result = client.predict(
        dict={"background": file(user_img_path)},
        garm_img=file(garment_img_path),
        **extra_params,
        api_name=api_endpoint
    )
    return result

def download_image(url, save_path="garment.jpg"):
    """
    Downloads an image from a given URL and saves it locally.
    Returns True on success, False otherwise.
    """
    response = requests.get(url)
    if response.status_code == 200:
        with open(save_path, "wb") as f:
            f.write(response.content)
        print("Image downloaded successfully!")
        return True
    else:
        print("Failed to download image:", response.status_code)
        return False

# ------------------------------
# STEP 10: Main Application Function
# ------------------------------
def getRec(user_preferences, user_id, bottom=False , df_processced , data_splits,w2v_model,item_colors,item_vectors,palette_path="data/color_palettes.json"):
    """
    Main recommendation function.
    
    Parameters:
    - user_preferences: dict with keys: age_group, gender, occasion, wear_type, colors, keywords, etc.
    - user_id: identifier (used for loading the user's photo e.g., "123.jpg")
    
    Returns:
    - The first try-on result image (PIL Image) for the top recommended outfit.
    """
    # Get outfit recommendations (sorted list)
    recommendations = recommend_outfit(
        user_preferences, data_splits, item_vectors, item_colors, 
        w2v_model, palette_path
    )
    
    # If no recommendation found, return None
    if not recommendations:
        print("No recommendations found.")
        return None

    # Choose the top recommendation
    rec = recommendations[0]
    print("\n=== TOP RECOMMENDED OUTFIT ===")
    
    # Process based on the outfit type
    img_result = None
    images_df = pd.read_csv("images.csv")
    
    if rec['type'] == 'Dress':
        dress = rec['dress']
        dress_index = rec['dress_index']
        image_link = images_df[images_df["filename"] == f"{dress_index}.jpg"]["link"].values[0]
        if download_image(image_link, "garment.jpg"):
            # Call the try-on API for dress using the appropriate client
            extra_params = {
                "garment_des": "Hello!!",
                "is_checked": True,
                "is_checked_crop": False,
                "denoise_steps": 30,
                "seed": 42
            }
            result = call_tryon_API("yisol/IDM-VTON", "garment.jpg", f"{user_id}.jpg", extra_params, "/tryon")
            # Optionally display all results
            for path in result:
                img = Image.open(path)
                display(img)
            img_result = Image.open(result[0])
        else:
            print("Could not download garment image for dress.")
    
    elif rec['type'] == 'Two-piece':
        top = rec['top']
        bottom = rec['bottom']
        top_index = rec['top_index']
        bottom_index = rec['bottom_index']
        
        # Process top garment first
        top_link = images_df[images_df["filename"] == f"{top_index}.jpg"]["link"].values[0]
        if download_image(top_link, "garment.jpg"):
            extra_params = {
                "garment_des": "Hello!!",
                "is_checked": True,
                "is_checked_crop": False,
                "denoise_steps": 30,
                "seed": 42
            }
            result_top = call_tryon_API("yisol/IDM-VTON", "garment.jpg", f"{user_id}.jpg", extra_params, "/tryon")
            for path in result_top:
                img = Image.open(path)
                display(img)
            # Use the first top try-on result as input for bottom garment processing
            vton_file = Image.open(result_top[0])
        else:
            print("Could not download garment image for top.")
            return None
        if(bottom==False):
           return vton_file 
        # Process bottom garment
        bottom_link = images_df[images_df["filename"] == f"{bottom_index}.jpg"]["link"].values[0]
        if download_image(bottom_link, "garment.jpg"):
            extra_params_bottom = {}  # Add any extra parameters if needed
            # Use a different client for bottom garment try-on
            result_bottom = call_tryon_API("levihsu/OOTDiffusion", "garment.jpg", None, 
                                           {"category": "Lower-body", "n_samples": 1, "n_steps": 20, "image_scale": 2, "seed": -1}, 
                                           "/process_dc")
            for path in result_bottom:
                # Here we assume the API returns URLs; adjust if they are local file paths.
                img = Image.open(requests.get(path, stream=True).raw)
                display(img)
            img_result = Image.open(requests.get(result_bottom[0], stream=True).raw)
        else:
            print("Could not download garment image for bottom.")
    
    return img_result
 