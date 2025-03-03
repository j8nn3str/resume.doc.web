// Bootstrap 5.3 Popover
import { Popover } from 'bootstrap'
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new Popover(popover)
  })