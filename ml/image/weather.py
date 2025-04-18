import http.client

conn = http.client.HTTPSConnection("open-weather13.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "13e550a633mshe1311b83d5f1cfbp160973jsnebc4d97ef170",
    'x-rapidapi-host': "open-weather13.p.rapidapi.com"
}

conn.request("GET", "/city/Mumbai/EN", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))