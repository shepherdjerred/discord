import _ from "lodash";

export function Gold({ value, durationInMinutes }: { value: number; durationInMinutes: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30rem" }}>
      <span style={{ fontWeight: 700 }}>{value.toLocaleString()} gold</span>
      <span>{_.round(value / durationInMinutes).toLocaleString()} / min</span>
    </div>
  );
}
