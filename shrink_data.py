import pandas as pd 

# Load your big file
df = pd.read_json('treesCDN.json')

# Keep ONLY the columns used in your script
columns_to_keep = ['nta_name', 'spc_common', 'borough', 'tree_id']
small_df = df[columns_to_keep]

# Save it as the same name to replace the big one
small_df.to_json('treesCDN.json', orient='records')

print(f"Done! The file is now much smaller.")