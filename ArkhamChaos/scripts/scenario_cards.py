
from urllib.request import urlopen
import json

from pathlib import Path

script_path = Path(__file__)
data_dir = script_path.parent.parent / "data"
data_file = data_dir / "scenarios.json"
data_dir.mkdir(exist_ok=True)

arkhamdb_api = "https://arkhamdb.com/api/public/cards/?encounter=1"

response = urlopen(arkhamdb_api)
card_data = json.loads(response.read())

scenario_cards = []
for card in card_data:
    if card["type_code"] == "scenario":
        scenario_cards.append(card)
        if card["name"] != card["real_name"]:
            print(card["name"] + " mismatch")
        if card["text"] != card["real_text"]:
            print(card["name"] + " text mismatch")


with open(data_file, "w") as file:
    file.write(json.dumps(scenario_cards))


print(f'Wrote {len(scenario_cards)} scenario cards to {data_file}')

