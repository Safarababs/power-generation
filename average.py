# import os
# import pandas as pd

# # Path to your folder
# folder = r"E:\Temporary Folder\data analyse"
# output_file = r"E:\Temporary Folder\data analyse\summary.csv"

# # Collect numeric data from all files
# dfs = []
# for filename in os.listdir(folder):
#     if filename.endswith(".csv"):  # adjust if files are not CSV
#         file_path = os.path.join(folder, filename)
        
#         # Read file
#         df = pd.read_csv(file_path)
        
#         # Drop the time column (first column)
#         numeric_df = df.iloc[:, 1:]
        
#         dfs.append(numeric_df)

# # Combine all numeric data
# all_data = pd.concat(dfs, ignore_index=True)

# # Compute statistics
# summary = pd.DataFrame({
#     "Average": all_data.mean(),
#     "Max": all_data.max(),
#     "Min": all_data.min()
# })

# # --- Add mapping dictionary here ---
# code_mapping = {
#     "SCA041PT101PV": "Fuel Temperature",
#     "SCA041TE101PV": "Engine Temperature",
#     "SCA041CV161PV": "Compressor Valve Position",
#     "SCA041CY161PV": "Cylinder Pressure",
#     "PCC041T002PV": "Turbine Temperature",
#     "PCC041F001PV": "Fuel Flow 1",
#     "PCC041F002PV": "Fuel Flow 2",
#     "PCC041T101PV": "Turbine Inlet Temp",
#     "PCC041E101PV": "Exhaust Temperature",
#     # Add more mappings as needed...
# }

# # Replace codes with descriptive names
# summary.index = summary.index.to_series().replace(code_mapping)

# # Save results
# summary.to_csv(output_file)

# print("Summary statistics saved to:", output_file)

import os
import pandas as pd

folder = r"E:\Temporary Folder\data analyse\Today"
output_file = r"E:\Temporary Folder\data analyse\final_summary.csv"

LOAD_CODE = "BAG041UP01PV"  # adjust to your actual load tag

summaries = []

for filename in os.listdir(folder):
    if filename.endswith(".csv"):
        file_path = os.path.join(folder, filename)
        df = pd.read_csv(file_path)

        # Create a proper datetime column
        df["Time"] = pd.to_datetime(df.iloc[:, 0], errors="coerce")

        # Detect load file
        if LOAD_CODE in df.columns:
            load_df = df[["Time", LOAD_CODE]].rename(columns={LOAD_CODE: "Load"})
        else:
            # Merge with load_df by time
            merged = df.merge(load_df, on="Time", how="inner")

            # Apply condition: only rows where Load > 5000
            filtered = merged[merged["Load"] > 5000]

            # Drop time and load columns for stats
            numeric_df = filtered.drop(columns=["Time", "Load"])

            stats = pd.DataFrame({
                "Average": numeric_df.mean(),
                "Max": numeric_df.max(),
                "Min": numeric_df.min()
            })

            # Add metadata
            parts = filename.split()
            stats["Engine"] = filename[3:6]  # e.g., "041"
            stats["From"] = parts[0] + " " + parts[1]
            stats["To"] = parts[2] + " " + parts[3]

            summaries.append(stats)

# Combine all summaries
final_summary = pd.concat(summaries)
final_summary.to_csv(output_file)

print("Final conditional summary saved to:", output_file)