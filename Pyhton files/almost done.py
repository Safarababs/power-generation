import os
import pandas as pd

folder = r"E:\Temporary Folder\data analyse\Yesterday"
output_file = r"E:\Temporary Folder\data analyse\final_summary.csv"

LOAD_CODE = "BAG041UP01PV"  # adjust to your actual load tag

# --- Step 1: Find and read the load file ---
load_df = None
for filename in os.listdir(folder):
    if filename.endswith(".csv"):
        file_path = os.path.join(folder, filename)
        df = pd.read_csv(file_path)
        df["Time"] = pd.to_datetime(df.iloc[:, 0], errors="coerce")
        
        if LOAD_CODE in df.columns:
            load_df = df[["Time", LOAD_CODE]].rename(columns={LOAD_CODE: "Load"})
            break

if load_df is None:
    raise ValueError("No load file found in folder!")

# --- Step 2: Process all other files ---
summaries = []
for filename in os.listdir(folder):
    if filename.endswith(".csv"):
        file_path = os.path.join(folder, filename)
        df = pd.read_csv(file_path)
        df["Time"] = pd.to_datetime(df.iloc[:, 0], errors="coerce")

        # Skip the load file itself
        if LOAD_CODE in df.columns:
            continue

        # Merge with load data by time
        merged = df.merge(load_df, on="Time", how="inner")

        # Apply condition: only rows where Load > 5000
        filtered = merged[merged["Load"] > 5000]

        # Drop time and load columns
        numeric_df = filtered.drop(columns=["Time", "Load"])

        # Convert everything to numeric safely
        numeric_df = numeric_df.apply(pd.to_numeric, errors="coerce")
        numeric_df = numeric_df.dropna(axis=1, how="all")


        # Now compute stats
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

# --- Step 3: Save final summary ---
final_summary = pd.concat(summaries)
final_summary.to_csv(output_file)

print("Final conditional summary saved to:", output_file)