// Temporal API — Stage 3 proposal
// This declaration covers the subset used in the project.
declare namespace Temporal {
  class PlainDate {
    static from(item: string): PlainDate
    toLocaleString(locale: string, options?: Intl.DateTimeFormatOptions): string
  }
}
