// Boortstrap 5.3 Tooltip
import { Tooltip } from 'bootstrap'
document.querySelectorAll('[data-bs-toggle="tooltip"]')
  .forEach(tooltip => {
    new Tooltip(tooltip)
  })