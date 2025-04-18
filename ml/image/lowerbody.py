import requests
from gradio_client import Client, handle_file

# Download image files locally
def download_file(url, filename):
    response = requests.get(url)
    with open(filename, 'wb') as f:
        f.write(response.content)
    return filename

vton_file = "body3.jpg"
garm_file = "pant.jpg"

# vton_file = download_file(vton_url, "model_8.png")
# garm_file = download_file(garm_url, "048554_1.jpg")

# Initialize client
client = Client("levihsu/OOTDiffusion")

# Call predict with category = Lower-body
result = client.predict(
    vton_img=handle_file(vton_file),
    garm_img=handle_file(garm_file),
    category="Lower-body",  # 👈 Changed here
    n_samples=1,
    n_steps=20,
    image_scale=2,
    seed=-1,
    api_name="/process_dc"
)

print(result)