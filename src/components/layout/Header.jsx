// src/components/Header.jsx
// COPY/PASTE ENTIRE FILE

export default function Header({ title, subtitle, right }) {
  return (
    <div className="headerWrap">
      <div className="headerLeft">
        {title ? <div className="pageTitle">{title}</div> : null}

        {subtitle ? (
          <div
            className="pageSubtitle"
            style={{
              fontSize: 16,
              lineHeight: 1.28,
              maxWidth: 1120,
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