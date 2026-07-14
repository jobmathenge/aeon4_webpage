const STANDARDS = [
  ["IEC 62443", "ZONES & CONDUITS"],
  ["ISA-95", "NAMESPACE"],
  ["MODBUS TCP", ""],
  ["OPC UA", ""],
  ["BACNET", ""],
  ["MQTT", ""],
  ["DNP3", ""],
  ["IEC 104", ""],
] as const;

export default function StandardsStrip() {
  return (
    <div className="strip" id="standards">
      {STANDARDS.map(([label, suffix]) => (
        <span key={label}>
          <b>{label}</b>
          {suffix ? ` ${suffix}` : ""}
        </span>
      ))}
    </div>
  );
}
