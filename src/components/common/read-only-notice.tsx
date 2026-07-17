export function ReadOnlyNotice() {
  return (
    <p
      role="status"
      className="border-border bg-muted/50 text-muted-foreground rounded-xl border px-3 py-2 text-sm"
    >
      Tu cuenta es de solo lectura. Puedes ver tus datos, pero no guardar cambios.
    </p>
  )
}
