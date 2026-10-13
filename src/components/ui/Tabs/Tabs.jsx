import './Tabs.css'

// Pestañas simples controladas por el componente padre
export default function Tabs({ tabs, active, onChange, label }) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={active === t.id}
          className={`tabs__tab ${active === t.id ? 'tabs__tab--active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.nombre}
        </button>
      ))}
    </div>
  )
}
