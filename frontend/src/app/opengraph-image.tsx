import { ImageResponse } from "next/og";

export const alt = "Absurt Yemek";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b",
          color: "white",
          padding: 72,
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 30, color: "#a1a1aa" }}>Yapay zeka destekli tarif uretici</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3 }}>Absurt Yemek</div>
          <div style={{ marginTop: 24, fontSize: 34, lineHeight: 1.25, color: "#d4d4d8", maxWidth: 900 }}>
            Evdeki malzemelerle yaratıcı tarifler uret, diyet ve mutfak tercihlerine gore kesfet.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 26, color: "#e4e4e7" }}>
          <span>Tarif uret</span>
          <span>•</span>
          <span>Kesfet</span>
          <span>•</span>
          <span>Puanla</span>
        </div>
      </div>
    ),
    size,
  );
}
