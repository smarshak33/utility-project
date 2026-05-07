import pandas as pd

def csv_to_json(csv_filepath, json_filepath):
    """
    Converts a CSV file to a JSON file.

    Args:
        csv_filepath (str): Path to the input CSV file.
        json_filepath (str): Path to the output JSON file.
    """
    df = pd.read_csv(csv_filepath)
    df.to_json(json_filepath, orient='records', indent=4)

csv_to_json('./treesCDN.csv', './treesCDN.json')