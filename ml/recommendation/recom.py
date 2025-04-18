import pandas as pd
import numpy as np
import json
from gensim.models import Word2Vec
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean
import colorsys

import pandas as pd
import numpy as np
import json
from gensim.models import Word2Vec
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean
import colorsys

# ------------------------------
# STEP 1: Load and Preprocess CSV
# ------------------------------
def preprocess_product_data(csv_path):
    """
    Loads a CSV file, processes gender and other attributes for recommendation.
    """
    df = pd.read_csv("recommendation/Ok.csv")
    df.drop(columns=["year"], inplace=True)
    
    # Set age_group based on the "ageGroup" column
    df['age_group'] = df['ageGroup'].apply(lambda x: 'Kids' if "Adults" not in str(x) else 'Adults')
    
    # Ensure we have gender information
    
    if 'gender' in df.columns:
        # If gender isn't explicitly in the dataset, try to infer it from other columns
        # This is a placeholder - you may need to adjust based on your actual data

        
        # Example of inference logic (adjust based on your data)
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
            # For exact gender matches or Unisex items which work for everyone
            gender_df = age_df[(age_df['gender'] == gender) | (age_df['gender'] == 'Unisex')].copy()
            
            # Split by clothing category
            if not gender_df.empty:
                # Dresses (female only)
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
    # Add occasion words to each product description if available
    sentences = []
    
    for _, row in df.iterrows():
        # Convert all relevant attributes to strings and combine into a list
        tokens = []
        for col in df.columns:
            # Skip numeric or irrelevant columns
            if col not in ['index', 'id', 'year']:
                tokens.append(str(row[col]))
        
        # Add extra tokens based on product type and potential occasions
        # This helps the model understand occasion-specific clothing
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
    Convert each row in the dataframe into a vector by averaging the word embeddings.
    Optionally weight tokens related to the requested occasion more heavily.
    """
    vectors = []
    # Use all relevant columns for vectorization
    token_columns = [col for col in df.columns if col not in ['index', 'id', 'year']]
    
    # Simple mapping of occasion-related keywords
    occasion_keywords = {
        'Formal': ['formal', 'office', 'business', 'work', 'professional', 'elegant'],
        'Casual': ['casual', 'everyday', 'relaxed', 'comfortable', 'leisure'],
        'Party': ['party', 'celebration', 'festive', 'glamorous', 'trendy'],
        'Ethnic': ['ethnic', 'traditional', 'cultural', 'festival', 'heritage']
    }
    
    for _, row in df.iterrows():
        tokens = []
        for col in token_columns:
            tokens.append(str(row[col]))
        
        # Get embeddings for each token
        token_vecs = []
        token_weights = []
        
        for token in tokens:
            if token in model.wv:
                # Apply higher weight for tokens matching the requested occasion
                weight = 1.0  # Default weight
                if occasion and occasion in occasion_keywords:
                    # Check if token matches any keywords for the occasion
                    if any(keyword in token.lower() for keyword in occasion_keywords[occasion]):
                        weight = 2.0  # Higher weight for occasion-relevant tokens
                
                token_vecs.append(model.wv[token])
                token_weights.append(weight)
        
        # Calculate weighted average if we have vectors
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
    Expanded color palette for better matching.
    """
    color = color.lower()
    color_map = {
        # Basic colors
        'red': (255, 0, 0), 'green': (0, 255, 0), 'blue': (0, 0, 255),
        'yellow': (255, 255, 0), 'purple': (128, 0, 128), 'orange': (255, 165, 0),
        'pink': (255, 192, 203), 'brown': (139, 69, 19), 'black': (0, 0, 0),
        'white': (255, 255, 255), 'gray': (169, 169, 169), 'beige': (245, 245, 220),
        
        # Extended colors
        'navy': (0, 0, 128), 'teal': (0, 128, 128), 'maroon': (128, 0, 0),
        'olive': (128, 128, 0), 'silver': (192, 192, 192), 'lime': (0, 255, 0),
        'aqua': (0, 255, 255), 'fuchsia': (255, 0, 255), 'cream': (255, 253, 208),
        'khaki': (240, 230, 140), 'lavender': (230, 230, 250), 'turquoise': (64, 224, 208),
        'indigo': (75, 0, 130), 'violet': (238, 130, 238), 'gold': (255, 215, 0),
        'coral': (255, 127, 80), 'magenta': (255, 0, 255), 'cyan': (0, 255, 255),
        'ivory': (255, 255, 240), 'emerald': (80, 200, 120), 'burgundy': (128, 0, 32)
    }
    return color_map.get(color, (255, 255, 255))  # default white if unknown

def color_compatibility_score(color1_rgb, color2_rgb):
    """
    Calculate a compatibility score between two colors using both distance and 
    color theory principles (complementary, analogous, etc.).
    
    Returns a value between 0-1 where higher means better compatibility.
    """
    # Convert RGB to HSV for better color theory analysis
    def rgb_to_hsv(rgb):
        r, g, b = [x/255.0 for x in rgb]
        h, s, v = colorsys.rgb_to_hsv(r, g, b)
        return (h, s, v)
    
    hsv1 = rgb_to_hsv(color1_rgb)
    hsv2 = rgb_to_hsv(color2_rgb)
    
    # Calculate hue difference (0-1 scale, where 0.5 is complementary)
    hue_diff = abs(hsv1[0] - hsv2[0])
    if hue_diff > 0.5:
        hue_diff = 1.0 - hue_diff
    
    # Different color relationships have different ideal hue distances
    # Complementary: ~0.5
    # Analogous: ~0.08-0.1
    # Triadic: ~0.33
    
    # Calculate a score based on common color schemes:
    complementary_score = 1.0 - abs(hue_diff - 0.5) * 2.0  # Highest at 0.5 difference
    analogous_score = 1.0 - min(abs(hue_diff) * 10.0, 1.0)  # Highest when close
    triadic_score = 1.0 - abs(hue_diff - 0.33) * 3.0        # Highest at 0.33 difference
    
    # For neutral colors (low saturation), direct compatibility is higher
    neutral_bonus = 0
    if hsv1[1] < 0.2 or hsv2[1] < 0.2:  # Low saturation
        neutral_bonus = 0.3  # Bonus for pairing with neutrals
    
    # Basic compatibility - higher when colors are either very similar or follow color theory
    base_score = max(complementary_score, analogous_score, triadic_score) + neutral_bonus
    
    # Special case: black and white go with everything
    if (color1_rgb == (0, 0, 0) or color1_rgb == (255, 255, 255) or 
        color2_rgb == (0, 0, 0) or color2_rgb == (255, 255, 255)):
        base_score = max(base_score, 0.8)  # Black/white have high compatibility
    
    return min(max(base_score, 0.0), 1.0)  # Ensure score stays between 0-1

# ------------------------------
# STEP 6: Occasion-Specific Color Palettes
# ------------------------------
def load_color_palette(occasion, palette_path="color_palettes.json"):
    """
    Loads color palettes from a JSON file and returns the palette for the given occasion.
    """
    try:
        with open(palette_path, "r") as f:
            color_palettes = json.load(f)
        # Return palette colors converted to RGB. If not found, return a default list.
        return [color_to_rgb(color) for color in color_palettes.get(occasion, [])]
    except (FileNotFoundError, json.JSONDecodeError):
        # Default palettes if file not found or invalid
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
    Calculate a comprehensive score for an outfit combination (two-piece or dress).
    
    For two-piece outfits: item1=top, item2=bottom
    For dresses: item1=dress, item2=None
    
    Returns a score between 0-1 where higher is better.
    """
    # 1. User preference match - how well each item matches user's style keywords
    user_item1_sim = cosine_similarity([user_pref_vec], [item1_vec])[0][0]
    
    # 2. For two-piece outfits, calculate item-to-item compatibility
    if item2_vec is not None:
        user_item2_sim = cosine_similarity([user_pref_vec], [item2_vec])[0][0]
        item_item_sim = cosine_similarity([item1_vec], [item2_vec])[0][0]
    else:
        # For dresses, we don't need item2 similarity, so set high values
        user_item2_sim = 1.0  # Not used for dresses
        item_item_sim = 1.0   # Not used for dresses

    # 3. Color compatibility scoring
    if item2_rgb is not None:
        # For two-piece outfits, check color compatibility between items
        color_sim = color_compatibility_score(item1_rgb, item2_rgb)
    else:
        # For dresses, check if color matches the occasion palette
        if occasion_palette:
            # Find closest color in palette to dress color
            color_matches = [1.0 / (1.0 + color_distance(item1_rgb, pal_rgb)) 
                            for pal_rgb in occasion_palette]
            color_sim = max(color_matches) if color_matches else 0.5
        else:
            color_sim = 0.5  # Neutral score if no palette
    
    # 4. Calculate final weighted score
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

def color_distance(c1, c2):
    """
    Computes the Euclidean distance between two RGB colors.
    """
    return euclidean(np.array(c1), np.array(c2))

# ------------------------------
# STEP 8: Main Recommendation Function
# ------------------------------
def recommend_outfit(user_preferences, data_splits, item_vectors, item_colors, 
                    w2v_model, palette_path="color_palettes.json"):
    """
    Recommend the best outfit based on user preferences.
    
    Parameters:
    - user_preferences: dict with age_group, gender, occasion, wear_type, colors, keywords
    - data_splits: dict of dataframes split by age, gender, and category
    - item_vectors: dict of vector matrices for each data split
    - item_colors: dict of RGB color lists for each data split
    - w2v_model: trained Word2Vec model
    
    Returns:
    - recommended outfit details
    - indices of selected items
    - recommendation score
    """
    # 1. Extract user preferences
    age_group = user_preferences.get('age_group', 'Adults')
    gender = user_preferences.get('gender', 'Female')
    occasion = user_preferences.get('occasion', 'Casual')
    wear_type = user_preferences.get('wear_type', 'Two-piece')
    keywords = user_preferences.get('keywords', [])
    
    # Color preferences
    topwear_color = user_preferences.get('topwear_color', None)
    bottomwear_color = user_preferences.get('bottomwear_color', None)
    dress_color = user_preferences.get('dress_color', None)
    
    # 2. Vectorize user preferences
    user_keywords = " ".join(keywords)
    if not user_keywords.strip():
        user_keywords = f"{occasion} {gender} {age_group}"
        
    # Add color preferences to keywords if specified
    if wear_type == 'Two-piece':
        if topwear_color:
            user_keywords += f" {topwear_color} top"
        if bottomwear_color:
            user_keywords += f" {bottomwear_color} bottom"
    else:  # Dress
        if dress_color:
            user_keywords += f" {dress_color} dress"
    
    # Vectorize user preferences
    user_tokens = user_keywords.lower().split()
    user_vecs = [w2v_model.wv[token] for token in user_tokens if token in w2v_model.wv]
    user_pref_vec = np.mean(user_vecs, axis=0) if user_vecs else np.zeros(w2v_model.vector_size)
    
    # 3. Load occasion color palette
    occasion_palette = load_color_palette(occasion, palette_path)
    
    # 4. Configure weighting for scoring
    weights = {
        "user_match": 0.4,         # How well items match user preferences
        "item_compatibility": 0.3,  # How well items complement each other
        "color_match": 0.3          # Color compatibility score
    }
    
    # 5. Determine which datasets to use based on user preferences
    best_score = -np.inf
    recommendation = None

    recommendations = []

    
    # Load appropriate data keys based on user preferences
    if wear_type == 'Dress' and gender == 'Female':
        # For dresses (female only)
        dress_key = f"{age_group}_{gender}_Dress"
        if dress_key in data_splits and not data_splits[dress_key].empty:
            dress_df = data_splits[dress_key]
            dress_vectors = item_vectors.get(dress_key, [])
            dress_colors = item_colors.get(dress_key, [])
            
            # Score each dress
            for i, dress_vec in enumerate(dress_vectors):
                if i < len(dress_colors):
                    dress_rgb = dress_colors[i]
                    
                    # If user specified a dress color, boost score for matching colors
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
                    
                    # if score > best_score:
                        # best_score = score
                    # recommendation = {
                    #     'type': 'Dress',
                    #     'dress': dress_df.iloc[i],
                    #     'dress_index': i,
                    #     'score': score
                    # }
        recommendations = sorted(recommendations, reverse=True, key=lambda x: x["score"])[:11]

    
    elif wear_type == 'Two-piece':
        # For two-piece outfits
        top_key = f"{age_group}_{gender}_Topwear"
        bottom_key = f"{age_group}_{gender}_Bottomwear"
        
        # Check if we have both top and bottom data for this age/gender
        if (top_key in data_splits and not data_splits[top_key].empty and
            bottom_key in data_splits and not data_splits[bottom_key].empty):
            
            top_df = data_splits[top_key]
            bottom_df = data_splits[bottom_key]
            top_vectors = item_vectors.get(top_key, [])
            bottom_vectors = item_vectors.get(bottom_key, [])
            top_colors = item_colors.get(top_key, [])
            bottom_colors = item_colors.get(bottom_key, [])
            
            # Score each top-bottom combination
            # To avoid excessive combinations, we'll use a heuristic approach
            
            # First, find the top N tops and bottoms that best match user preferences
            top_matches = []
            for i, top_vec in enumerate(top_vectors):
                if i < len(top_colors):
                    user_top_sim = cosine_similarity([user_pref_vec], [top_vec])[0][0]
                    
                    # Boost score for color match if specified
                    if topwear_color and topwear_color.lower() in str(top_df.iloc[i]['baseColour']).lower():
                        user_top_sim += 0.2
                    
                    top_matches.append((i, user_top_sim))
            
            bottom_matches = []
            for i, bottom_vec in enumerate(bottom_vectors):
                if i < len(bottom_colors):
                    user_bottom_sim = cosine_similarity([user_pref_vec], [bottom_vec])[0][0]
                    
                    # Boost score for color match if specified
                    if bottomwear_color and bottomwear_color.lower() in str(bottom_df.iloc[i]['baseColour']).lower():
                        user_bottom_sim += 0.2
                    
                    bottom_matches.append((i, user_bottom_sim))
            
            # Sort and get top candidates
            top_matches.sort(key=lambda x: x[1], reverse=True)
            bottom_matches.sort(key=lambda x: x[1], reverse=True)
            
            # Take top 10 of each (or fewer if not available)
            top_candidates = top_matches[:min(10, len(top_matches))]
            bottom_candidates = bottom_matches[:min(10, len(bottom_matches))]
            
            # Evaluate combinations of top candidates
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
                            
                            # if score > best_score:
                            #     best_score = score
                            #     recommendation = {
                            #         'type': 'Two-piece',
                            #         'top': top_df.iloc[top_idx],
                            #         'bottom': bottom_df.iloc[bottom_idx],
                            #         'top_index': top_idx,
                            #         'bottom_index': bottom_idx,
                            #         'score': score
                            #     }
        recommendations = sorted(recommendations, reverse=True, key=lambda x: x["score"])[:11]

    # Return the best recommendation found
    return recommendations


def update_weights_on_rejection(user_input, df, rejected_product_idx, adjustment_factor=0.01):
    """
    Adjust the feature weights when a product is rejected by the user.
    """
    print(f"Updating weights after rejection of product at index {rejected_product_idx}...")
    rejected_product = df.iloc[rejected_product_idx]
    for feature in rejected_product:
        if feature in user_input:
            feature_weights[feature] -= adjustment_factor
            print(f"Decreased weight for feature '{feature}' by {adjustment_factor}")
    
    feature_weights = {k: max(v, 0.1) for k, v in feature_weights.items()}
    print("Updated feature weights after rejection:", feature_weights)
    return feature_weights

# ------------------------------
# STEP 9: Main Application
# ------------------------------
def main():
    # Configuration
    csv_path = 'Ok.csv'
    palette_path = "color_palettes.json"
    
    # Load and preprocess data
    df_processed = preprocess_product_data(csv_path)
    print(f"Loaded dataset with {len(df_processed)} items.")
    
    # Split data by categories
    data_splits = split_data_by_criteria(df_processed)
    print(f"Data split into {len(data_splits)} categories.")
    
    # Train Word2Vec model on all data
    w2v_model = train_word2vec(df_processed, vector_size=100)
    print("Word2Vec model trained successfully.")
    
    # Vectorize each data split and extract colors
    item_vectors = {}
    item_colors = {}
    
    for key, df_split in data_splits.items():
        # Vectorize items
        item_vectors[key] = vectorize_dataframe(df_split, w2v_model)
        
        # Extract colors 
        item_colors[key] = df_split['baseColour'].apply(color_to_rgb).tolist()
        
        print(f"Processed {key}: {len(df_split)} items")
    
    # Interactive recommendation loop
    while True:
        print("\n--- Outfit Recommendation System ---")
        print("Please enter your preferences:")
        
        # Collect user preferences
        age_group = input("Age group (Kids/Adults): ").strip() or "Adults"
        gender = input("Gender (Male/Female): ").strip() or "Female"
        occasion = input("Occasion (Formal/Casual/Party/Ethnic): ").strip() or "Casual"
        
        # For females, offer dress option
        if gender.lower() == "female":
            wear_type = input("Wear type (Dress/Two-piece): ").strip() or "Two-piece"
        else:
            wear_type = "Two-piece"
        
        # Get color preferences based on wear type
        if wear_type.lower() == "two-piece":
            topwear_color = input("Preferred topwear color (or leave blank): ").strip()
            bottomwear_color = input("Preferred bottomwear color (or leave blank): ").strip()
            dress_color = None
        else:
            dress_color = input("Preferred dress color (or leave blank): ").strip()
            topwear_color = None
            bottomwear_color = None
        
        # Get additional style keywords
        keywords_input = input("Additional style keywords (comma-separated): ").strip()
        keywords = [k.strip() for k in keywords_input.split(",")] if keywords_input else []
        
        # Create user preference dictionary
        user_preferences = {
            'age_group': age_group,
            'gender': gender,
            'occasion': occasion,
            'wear_type': wear_type,
            'topwear_color': topwear_color,
            'bottomwear_color': bottomwear_color,
            'dress_color': dress_color,
            'keywords': keywords
        }
        
        # Get recommendation
        recommendations = recommend_outfit(
            user_preferences, data_splits, item_vectors, item_colors, 
            w2v_model, palette_path
        )

        print(len(recommendations))

        # recommendation = recommendations[0]

        
        
        # Display recommendation
        # if recommendation:
        for recommendation in recommendations:
            print("\n=== RECOMMENDED OUTFIT ===")
            
            if recommendation['type'] == 'Dress':
                dress = recommendation['dress']
                dress_index = recommendation['dress_index']
                print(f"Dress (Index: {dress_index})")
                print(f"  Name: {dress.get('productDisplayName', 'N/A')}")
                print(f"  Color: {dress.get('baseColour', 'N/A')}")
                print(f"  Type: {dress.get('articleType', 'N/A')}")
                print(f"  Size: {dress.get('size', 'N/A')}")
                print(f"  Match score: {recommendation['score']:.3f}")
            
            else:  # Two-piece
                top = recommendation['top']
                bottom = recommendation['bottom']
                top_index = recommendation['top_index']
                bottom_index = recommendation['bottom_index']
                
                print(f"Top (Index: {top_index})")
                print(f"  Name: {top.get('productDisplayName', 'N/A')}")
                print(f"{top["productID"]=}")
                print(f"  Color: {top.get('baseColour', 'N/A')}")
                print(f"  Type: {top.get('articleType', 'N/A')}")
                print(f"  Size: {top.get('size', 'N/A')}")
                
                print(f"\nBottom (Index: {bottom_index})")
                print(f"{bottom["productID"]=}")
                print(f"  Name: {bottom.get('productDisplayName', 'N/A')}")
                print(f"  Color: {bottom.get('baseColour', 'N/A')}")
                print(f"  Type: {bottom.get('articleType', 'N/A')}")
                print(f"  Size: {bottom.get('size', 'N/A')}")
                
                print(f"\nOutfit match score: {recommendation['score']:.3f}")

        else:
            print("\nSorry, no suitable recommendations found for your preferences.")
            print("Try adjusting your preferences or expanding your criteria.")
        
        # Ask if user wants another recommendation
        again = input("\nWould you like another recommendation? (yes/no): ").strip().lower()
        if again != 'yes' and again != 'y':
            print("Thank you for using the outfit recommendation system!")
            break

if __name__ == "__main__":
    main()

# TODO: CHANGE THE FOR LOOP IN MAIN function