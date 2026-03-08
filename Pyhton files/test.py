from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os
import re
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route("/summary", methods=["GET"])
def get_summary():
    folder = r"E:\Temporary Folder\data analyse\Yesterday"
    LOAD_CODE = "BAG041UP01PV"

    load_df = None
    summaries = []

    # Step 1: Find load file
    for filename in os.listdir(folder):
        if filename.endswith(".csv"):
            file_path = os.path.join(folder, filename)
            df = pd.read_csv(file_path)
            df["Time"] = pd.to_datetime(df.iloc[:, 0], errors="coerce")

            if LOAD_CODE in df.columns:
                load_df = df[["Time", LOAD_CODE]].rename(columns={LOAD_CODE: "Load"})
                break

    if load_df is None:
        return jsonify({"error": "No load file found"}), 400

    # Step 2: Process other files
    for filename in os.listdir(folder):
        if filename.endswith(".csv"):
            file_path = os.path.join(folder, filename)
            df = pd.read_csv(file_path)
            df["Time"] = pd.to_datetime(df.iloc[:, 0], errors="coerce")

            if LOAD_CODE in df.columns:
                continue

            merged = df.merge(load_df, on="Time", how="inner")
            filtered = merged[merged["Load"] > 5000]

            numeric_df = filtered.drop(columns=["Time", "Load"])
            numeric_df = numeric_df.apply(pd.to_numeric, errors="coerce").dropna(axis=1, how="all")

            stats = pd.DataFrame({
                "Average": numeric_df.mean(),
                "Max": numeric_df.max(),
                "Min": numeric_df.min()
            })

            stats = stats.reset_index().rename(columns={"index": "Parameter"})

            # Extract engine number from filename
            match = re.search(r"BAG(\d{3})", filename)
            if match:
                engine_code = match.group(1)
                engine_number = int(engine_code) // 10
                stats["Engine"] = engine_number
            else:
                stats["Engine"] = "Unknown"

            summaries.append(stats)

    if not summaries:
        return jsonify({"error": "No summaries generated"}), 400

    final_summary = pd.concat(summaries)

    # Step 3: Save to Firestore
    for _, row in final_summary.iterrows():
        doc = {
            "date": pd.Timestamp.now().strftime("%Y-%m-%d"),
            "engine_no": row["Engine"],
            "parameter": row["Parameter"],
            "avg_value": float(row["Average"]),
            "max_value": float(row["Max"]),
            "min_value": float(row["Min"]),
            "alert_flag": row["Average"] > 115  # Example setpoint check
        }
        db.collection("engine_summary").add(doc)

    return jsonify(final_summary.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(port=5000, debug=True)