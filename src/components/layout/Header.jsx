// src/components/Header.jsx
// COPY/PASTE ENTIRE FILE

export default function Header({ title, subtitle, right }) {
  return (
    <div className="headerWrap">
<div
  className="headerLeft"
  style={{
    display: "grid",
    gap: 12,
  }}
>        {title ? <div className="pageTitle">{title}</div> : null}

        {subtitle ? (
          <div
            className="pageSubtitle"
            style={{
              fontSize: 16,
              lineHeight: 1.28,
              maxWidth: 1000,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      {right ? <div className="headerRight">{right}</div> : null}
    </div>
  );
}