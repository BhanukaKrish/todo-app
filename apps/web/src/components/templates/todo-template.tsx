interface TodoTemplateProps {
  header: React.ReactNode
  aside: React.ReactNode
  toolbar: React.ReactNode
  children: React.ReactNode
}

export function TodoTemplate({ header, aside, toolbar, children }: TodoTemplateProps) {
  return (
    <div className="min-h-svh bg-muted/30">
      {header}
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:py-10">
        <aside className="lg:sticky lg:top-24">{aside}</aside>
        <section aria-labelledby="todos-heading" className="grid gap-4">
          {toolbar}
          {children}
        </section>
      </main>
    </div>
  )
}
