const services = [
  {
    id: 'aadhaar',
    domains: ['uidai.gov.in'],
    title: 'Aadhaar Steps',
    description: 'Follow these steps for Aadhaar update and verification.',
    steps: [
      'Locate the nearest Aadhaar Seva Kendra or use the UIDAI portal.',
      'Fill the Aadhaar update/correction form accurately.',
      'Submit your biometric details at the center.',
      'Pay the required Aadhaar update fee.',
      'Collect the acknowledgement slip with your URN.',
      'Track the status with the URN on UIDAI portal.'
    ]
  },
  {
    id: 'pan',
    domains: ['onlineservices.nsdl.com', 'utitsl.com'],
    title: 'PAN Card Steps',
    description: 'Follow these steps to complete your PAN application.',
    steps: [
      'Open the PAN application portal for your provider.',
      'Select the appropriate PAN application form.',
      'Enter your personal and contact details accurately.',
      'Upload identity and address proofs as required.',
      'Pay the PAN processing fee online.',
      'Save the acknowledgement number for tracking.'
    ]
  },
  {
    id: 'passport',
    domains: ['passportindia.gov.in'],
    title: 'Passport Steps',
    description: 'Follow these steps for a passport application or renewal.',
    steps: [
      'Register or login on the Passport Seva portal.',
      'Fill the passport application form correctly.',
      'Upload the required documents and photographs.',
      'Pay the passport application fee.',
      'Book an appointment at the Passport Seva Kendra.',
      'Attend the appointment with originals and collect the receipt.'
    ]
  },
  {
    id: 'driving',
    domains: ['parivahan.gov.in'],
    title: 'Driving License Steps',
    description: 'Follow these steps to renew or apply for a driving licence.',
    steps: [
      'Go to the Parivahan driving licence section.',
      'Choose the renewal or new application option.',
      'Fill in your driving licence details accurately.',
      'Upload address proof and identity documents.',
      'Pay the driving licence application fee online.',
      'Book an appointment and appear for verification if required.'
    ]
  }
]

function findService(hostname) {
  return services.find((service) =>
    service.domains.some((domain) => hostname.endsWith(domain))
  )
}

function isDarkBackground(color) {
  if (!color || color === 'transparent') return false
  const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (!rgb) return false
  const r = Number(rgb[1])
  const g = Number(rgb[2])
  const b = Number(rgb[3])
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 140
}

function createOverlay(service, isDarkMode) {
  const overlay = document.createElement('div')

  // ===== FIXED POSITION =====
  overlay.style.position = 'fixed'
  overlay.style.top = '20px'
  // Initially anchor to the left so resizing bottom-right corner feels stable
  overlay.style.left = `max(20px, calc(100vw - 360px))`
  overlay.style.right = 'auto'
  overlay.style.bottom = 'auto'

  // ===== SIZE & RESIZE =====
  overlay.style.width = '320px'
  overlay.style.maxHeight = '70vh'
  overlay.style.overflow = 'auto'
  overlay.style.resize = 'both'
  overlay.style.minWidth = '200px'
  overlay.style.minHeight = '150px'

  // ===== STYLE =====
  overlay.style.background = isDarkMode ? '#222' : '#ffffff'
  overlay.style.color = isDarkMode ? '#fff' : '#000'
  overlay.style.border = '1px solid rgba(0,0,0,0.15)'
  overlay.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
  overlay.style.padding = '16px'
  overlay.style.zIndex = '999999'
  overlay.style.borderRadius = '8px'
  overlay.style.fontFamily = 'Arial, sans-serif'

  // ===== HEADER =====
  const header = document.createElement('div')
  header.style.display = 'flex'
  header.style.justifyContent = 'space-between'
  header.style.alignItems = 'center'
  header.style.cursor = 'grab'
  header.style.paddingBottom = '8px'
  header.style.borderBottom = '1px solid rgba(128,128,128,0.2)'
  header.style.marginBottom = '12px'

  const title = document.createElement('h3')
  title.textContent = service.title
  title.style.margin = '0'
  title.style.fontSize = '16px'
  title.style.pointerEvents = 'none' // Let drag events pass through

  const close = document.createElement('button')
  close.textContent = '×'
  close.style.border = 'none'
  close.style.background = 'transparent'
  close.style.fontSize = '24px'
  close.style.cursor = 'pointer'
  close.style.color = 'inherit'
  close.style.padding = '0 4px'
  close.style.lineHeight = '1'

  close.addEventListener('click', (e) => {
    e.stopPropagation() // Prevent triggering drag
    overlay.remove()
  })

  header.appendChild(title)
  header.appendChild(close)

  // ===== DRAGGING LOGIC =====
  let isDragging = false
  let dragOffsetX = 0
  let dragOffsetY = 0

  header.addEventListener('mousedown', (e) => {
    if (e.target === close) return // don't drag if clicking close

    isDragging = true
    header.style.cursor = 'grabbing'
    
    const rect = overlay.getBoundingClientRect()
    // Calculate where inside the header we clicked
    dragOffsetX = e.clientX - rect.left
    dragOffsetY = e.clientY - rect.top
    
    e.preventDefault() // prevent text selection
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    
    // Position based on current mouse minus the offset where we clicked
    let newLeft = e.clientX - dragOffsetX
    let newTop = e.clientY - dragOffsetY
    
    // Prevent dragging off screen entirely
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 50))
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - 50))
    
    overlay.style.left = newLeft + 'px'
    overlay.style.top = newTop + 'px'
    overlay.style.right = 'auto' // ensure right anchor is cleared
  })

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false
      header.style.cursor = 'grab'
    }
  })

  // ===== CONTENT =====
  const description = document.createElement('p')
  description.textContent = service.description

  const list = document.createElement('ol')
  service.steps.forEach((step) => {
    const item = document.createElement('li')
    item.textContent = step
    list.appendChild(item)
  })

  const footer = document.createElement('p')
  footer.textContent = 'Tip: follow these steps while using the website.'
  footer.style.fontSize = '12px'
  footer.style.opacity = '0.7'

  overlay.appendChild(header)
  overlay.appendChild(description)
  overlay.appendChild(list)
  overlay.appendChild(footer)

  document.body.appendChild(overlay)
}

function initOverlay() {
  const hostname = window.location.hostname.toLowerCase()
  const service = findService(hostname)
  if (!service) return

  const bodyStyles = window.getComputedStyle(document.body)
  const bodyColor = bodyStyles.backgroundColor || '#ffffff'
  const darkMode = isDarkBackground(bodyColor)

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () =>
      createOverlay(service, darkMode)
    )
  } else {
    createOverlay(service, darkMode)
  }
}

initOverlay()