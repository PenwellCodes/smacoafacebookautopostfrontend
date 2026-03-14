export default function Header({ title, subtitle }) {
    return (
      <div className="page-header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    );
  }