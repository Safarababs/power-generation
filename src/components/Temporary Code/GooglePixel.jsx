import PixelCard from "./PixelCard";

// Replace this with your fullPixelStock array
import pixel256Stock from "./fullPixelStockData";

const FullPixelInventory = () => (
  <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
    <h1>📱 Google Pixel Full Inventory</h1>
    {pixel256Stock.map((item, index) => (
      <PixelCard
        key={index}
        model={item.model}
        quantity={item.quantity}
        specs={item.specs}
        variants={item.variants}
        price={item.price}
      />
    ))}
  </div>
);

export default FullPixelInventory;
