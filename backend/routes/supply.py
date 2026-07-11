"""/api/supply — supply-chain signal: the retailer's latest inbound cargo ship.

Serves the shipping carrier the retailer uses, the most recent vessel to
arrive, its port, and the inventory on board. Seed rows until a real AIS/port
data pull lands.
"""

import json

from fastapi import APIRouter, HTTPException

from database import get_conn
from schemas import ShipmentItem, SupplyResponse

router = APIRouter()


@router.get("/api/supply", response_model=SupplyResponse)
def get_supply(store_id: int):
    conn = get_conn()
    try:
        row = conn.execute(
            "SELECT * FROM shipments WHERE store_id = ?", (store_id,)
        ).fetchone()
    finally:
        conn.close()

    if row is None:
        raise HTTPException(404, f"No supply-chain data for store {store_id}")

    items = [ShipmentItem(**i) for i in json.loads(row["inventory_json"])]
    return SupplyResponse(
        store_id=store_id,
        carrier=row["carrier"],
        ship_name=row["ship_name"],
        port=row["port"],
        arrived_at=row["arrived_at"],
        items=items,
        total_containers=sum(i.containers for i in items),
    )
