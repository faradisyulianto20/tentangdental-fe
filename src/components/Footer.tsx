export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[var(--footer-bg)] text-center text-sm text-[var(--text-muted)]">
      <div className="page-wrap py-10">
        <p className="m-0">
          &copy; {year} Your name here. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
