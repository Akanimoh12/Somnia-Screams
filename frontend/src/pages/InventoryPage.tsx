import Inventory from '../components/features/dashboard/Inventory';

// Items and collections
export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white title-font mb-2">Inventory</h1>
          <p className="text-secondary">Manage your collected souls, items, and power-ups</p>
        </div>
        
        <Inventory />
      </div>
    </div>
  );
}
