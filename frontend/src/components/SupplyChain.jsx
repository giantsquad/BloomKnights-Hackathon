// Supply-chain panel: the carrier the retailer uses, the latest cargo ship
// to arrive, its port, and the inventory on board. Data shape:
// SupplyResponse in backend/schemas.py.

export default function SupplyChain({ data }) {
  if (!data) return <div className="panel-empty">Loading supply chain…</div>

  return (
    <div className="supply">
      <dl className="supply-facts">
        <div>
          <dt>Carrier</dt>
          <dd>{data.carrier}</dd>
        </div>
        <div>
          <dt>Latest ship</dt>
          <dd>{data.ship_name}</dd>
        </div>
        <div>
          <dt>Port</dt>
          <dd>{data.port}</dd>
        </div>
        <div>
          <dt>Arrived</dt>
          <dd>{data.arrived_at}</dd>
        </div>
      </dl>

      <table className="supply-table">
        <thead>
          <tr>
            <th>Inventory on board</th>
            <th>Containers</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((i) => (
            <tr key={i.item}>
              <td>{i.item}</td>
              <td>{i.containers}</td>
            </tr>
          ))}
          <tr className="supply-total">
            <td>Total</td>
            <td>{data.total_containers}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
