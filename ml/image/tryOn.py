from gradio_client import Client, file
from PIL import Image
from IPython.display import display
import base64
import requests
from io import BytesIO

# Step 1: Set up the client and input
client = Client("yisol/IDM-VTON")
garment_image_path = "garment.png"  # Your garment image
user_image_path = "user.jpg"        # Your user photo

# Step 2: Call the try-on API
result = client.predict(
    dict={"background": file(user_image_path)},
    garm_img=file(garment_image_path),
    garment_des="Hello!!",
    is_checked=True,
    is_checked_crop=False,
    denoise_steps=30,
    seed=42,
    api_name="/tryon"
)

# Step 3: Display all result images
for path in result:
    img = Image.open(path)
    display(img)

# Step 4: Convert the first result image to Base64
first_img = Image.open(result[0])
buffered = BytesIO()
first_img.save(buffered, format="PNG")
img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

# Step 5: Send the image to localhost:8080 as JSON
json_data = {
    "image": img_base64
}

try:
    response = requests.post("http://localhost:8080", json=json_data)
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)
except requests.exceptions.RequestException as e:
    print("Error sending request:", e)