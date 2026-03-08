

import os
import pandas as pd

folder = r"E:\Temporary Folder\data analyse\Today"
output_detailed = r"E:\Temporary Folder\data analyse\detailed_output.csv"
output_summary = r"E:\Temporary Folder\data analyse\summary_output.csv"

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
all_filtered = []
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

        # --- Resample to 1-minute interval ---
        filtered.set_index("Time", inplace=True)
        resampled = filtered.resample("1min").mean().reset_index()


        # Format Time column in dd:mm:yyyy hh:mm:ss
        resampled["Time"] = resampled["Time"].dt.strftime("%d:%m:%Y %H:%M:%S")

        # Add metadata
        parts = filename.split()
        resampled["Engine"] = filename[3:6]
        resampled["From"] = parts[0] + " " + parts[1]
        resampled["To"] = parts[2] + " " + parts[3]

        all_filtered.append(resampled)

        # --- Compute summary stats for this file ---
        numeric_df = resampled.drop(columns=["Time", "Load", "Engine", "From", "To"])
        numeric_df = numeric_df.apply(pd.to_numeric, errors="coerce").dropna(axis=1, how="all")

        stats = pd.DataFrame({
            "Average": numeric_df.mean(),
            "Max": numeric_df.max(),
            "Min": numeric_df.min()
        })

        stats["Engine"] = filename[3:6]
        stats["From"] = parts[0] + " " + parts[1]
        stats["To"] = parts[2] + " " + parts[3]

        summaries.append(stats)

# --- Step 3: Save outputs ---
final_detailed = pd.concat(all_filtered)
final_summary = pd.concat(summaries)

final_detailed.to_csv(output_detailed, index=False)
final_summary.to_csv(output_summary)

print("Detailed (1-minute interval) and summary outputs saved.")