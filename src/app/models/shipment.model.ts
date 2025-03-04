export interface Shipment {
  id: string;
  shipperName: string;
  phoneNo: string;
  status: 'completed' | 'in-transit' | 'pending' | 'failed' | 'closed';
  product: string;
  supplier: string;
  quantity: number;
  price: number;
  deliveryDate?: string;
  consignee?: string;
  destination?: string;
  connection?: string;
  task?: string;
}

export type ShipmentStatus = 'all' | 'completed' | 'in-transit' | 'pending' | 'failed' | 'closed'; 