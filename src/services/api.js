// Mock Database for Services and Sub-services

const MOCK_SERVICES = [
  {
    id: 'aadhaar',
    icon: '🪪',
    title: 'Aadhaar Services',
    subtitle: 'Apply, update, or download your Aadhaar card',
    time: '5-10 mins',
    fee: 'Free / ₹50',
    portalLink: 'https://myaadhaar.uidai.gov.in/',
    portalName: 'myAadhaar Portal',
    docs: [
      { name: 'Proof of Identity', format: 'PDF/JPG', size: 'Max 2MB' },
      { name: 'Proof of Address', format: 'PDF/JPG', size: 'Max 2MB' },
      { name: 'Proof of Date of Birth', format: 'PDF/JPG', size: 'Max 2MB' }
    ],
    steps: []
  },
  {
    id: 'driving',
    icon: '🚗',
    title: 'Driving License',
    subtitle: 'Learner\'s, permanent, or renewal of license',
    time: '15-20 mins',
    fee: '₹200 - ₹1000',
    portalLink: 'https://parivahan.gov.in/parivahan/',
    portalName: 'Parivahan Sewa Portal',
    docs: [
      { name: 'Age Proof', format: 'PDF/JPG', size: 'Max 2MB' },
      { name: 'Address Proof', format: 'PDF/JPG', size: 'Max 2MB' },
      { name: 'Passport Size Photograph', format: 'JPG', size: 'Max 50KB' }
    ],
    steps: []
  },
  {
    id: 'pan',
    icon: '💳',
    title: 'PAN Card Services',
    subtitle: 'Apply for a new PAN card or update existing details',
    time: '15-20 mins',
    fee: '₹107 - ₹1017',
    portalLink: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    portalName: 'NSDL PAN Portal',
    docs: [
      { name: 'Proof of Identity', format: 'PDF/JPG', size: 'Max 2MB' },
      { name: 'Proof of Address', format: 'PDF/JPG', size: 'Max 2MB' },
      { name: 'Proof of Date of Birth', format: 'PDF/JPG', size: 'Max 2MB' },
      { name: 'Passport Size Photograph', format: 'JPG', size: 'Max 50KB' }
    ],
    steps: [
      { title: 'Fill Application', desc: 'Fill the Form 49A (for Indian citizens) on the NSDL or UTIITSL website.' },
      { title: 'Upload Documents', desc: 'Scan and upload your photograph, signature, and supporting documents.' },
      { title: 'Pay Fee', desc: 'Pay the application fee via accepted online payment modes.' },
      { title: 'e-Sign / Send Docs', desc: 'Authenticate via Aadhaar e-KYC or physically post documents to NSDL/UTIITSL.' }
    ]
  },
  {
    id: 'passport',
    icon: '🛂',
    title: 'Passport Services',
    subtitle: 'New passport, renewal, or police clearance',
    time: '20-30 mins',
    fee: '₹1500 - ₹2000',
    portalLink: 'https://www.passportindia.gov.in/',
    portalName: 'Passport Seva Kendra',
    docs: [
      { name: 'Proof of Address', format: 'PDF/JPG', size: 'Max 2MB' },
      { name: 'Proof of Date of Birth', format: 'PDF', size: 'Max 2MB' }
    ],
    steps: [
      { title: 'Register', desc: 'Register yourself on the Passport Seva Online Portal.' },
      { title: 'Apply', desc: 'Click on "Apply for Fresh Passport/Re-issue of Passport" link.' },
      { title: 'Payment & Appointment', desc: 'Pay the fee and book your appointment.' },
      { title: 'Visit PSK', desc: 'Visit the Passport Seva Kendra (PSK) with original documents.' }
    ]
  }
]

const MOCK_SUB_SERVICES = {
  'aadhaar': {
    'get-aadhaar': {
      title: 'Get Aadhaar',
      steps: [
        { title: 'Locate an Enrolment Center', desc: 'Find your nearest Aadhaar Seva Kendra.' },
        { title: 'Book an Appointment', desc: 'Book an appointment online.' },
        { title: 'Visit the Center', desc: 'Go to the center with required documents.' }
      ],
      docs: [
        { name: 'Proof of Identity', format: 'PDF/JPG', size: 'Max 2MB' },
        { name: 'Proof of Address', format: 'PDF/JPG', size: 'Max 2MB' }
      ],
      portalLink: 'https://myaadhaar.uidai.gov.in/',
      portalName: 'myAadhaar Portal'
    },
    'update-aadhaar': {
      title: 'Update Aadhaar',
      steps: [
        { title: 'Login', desc: 'Login to the myAadhaar portal using Aadhaar number and OTP.' },
        { title: 'Select Update Type', desc: 'Choose what you want to update (Address, Mobile, etc.).' },
        { title: 'Upload Documents', desc: 'Upload the required valid proof documents.' },
        { title: 'Submit & Pay', desc: 'Submit the request and pay the fee if applicable.' }
      ],
      docs: [
        { name: 'Proof of Identity', format: 'PDF/JPG', size: 'Max 2MB' },
        { name: 'Proof of Address', format: 'PDF/JPG', size: 'Max 2MB' }
      ],
      portalLink: 'https://myaadhaar.uidai.gov.in/',
      portalName: 'myAadhaar Portal'
    }
  },
  'driving': {
    'learners-license': {
      title: 'Learner\'s License',
      steps: [
        { title: 'Apply Online', desc: 'Fill the application form on Parivahan Sewa.' },
        { title: 'Upload Documents', desc: 'Upload photo, signature, and required proofs.' },
        { title: 'Fee Payment', desc: 'Pay the required application fee.' },
        { title: 'LL Test Slot Booking', desc: 'Book a slot for the Learner\'s License test.' }
      ],
      docs: [
        { name: 'Age Proof', format: 'PDF/JPG', size: 'Max 2MB' },
        { name: 'Address Proof', format: 'PDF/JPG', size: 'Max 2MB' }
      ],
      portalLink: 'https://parivahan.gov.in/parivahan/',
      portalName: 'Parivahan Sewa Portal'
    },
    'driving-school': {
      title: 'Driving School',
      steps: [
        { title: 'Find a School', desc: 'Search for authorized accredited driving schools.' },
        { title: 'Enroll', desc: 'Register with the selected driving school.' },
        { title: 'Training', desc: 'Complete the required training course.' },
        { title: 'Certificate', desc: 'Receive your training certificate.' }
      ],
      docs: [
        { name: 'ID Proof', format: 'PDF/JPG', size: 'Max 2MB' }
      ],
      portalLink: 'https://parivahan.gov.in/parivahan/',
      portalName: 'Parivahan Sewa Portal'
    },
    'online-test': {
      title: 'Online Test / Appointment',
      steps: [
        { title: 'Login', desc: 'Access the Parivahan portal with your application details.' },
        { title: 'Select Slot', desc: 'Choose an available time slot for your test.' },
        { title: 'Take Test', desc: 'Appear for the online or in-person driving knowledge test.' }
      ],
      docs: [
        { name: 'Application Form', format: 'PDF', size: 'Max 2MB' },
        { name: 'Learner License (if applicable)', format: 'PDF', size: 'Max 2MB' }
      ],
      portalLink: 'https://parivahan.gov.in/parivahan/',
      portalName: 'Parivahan Sewa Portal'
    },
    'other-services': {
      title: 'Other Services',
      steps: [
        { title: 'Select Service', desc: 'Choose the specific service like address change or duplicate license.' },
        { title: 'Fill Form & Upload', desc: 'Provide necessary details and supporting documents.' },
        { title: 'Submit & Pay', desc: 'Complete the submission and pay fees if applicable.' }
      ],
      docs: [
        { name: 'Original License', format: 'PDF/JPG', size: 'Max 2MB' },
        { name: 'Relevant Proofs', format: 'PDF/JPG', size: 'Max 2MB' }
      ],
      portalLink: 'https://parivahan.gov.in/parivahan/',
      portalName: 'Parivahan Sewa Portal'
    }
  }
}

// ------------------------------------
// Mock Authentication endpoints
// ------------------------------------
export async function apiLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Basic mock validation
      if (email && password) {
        resolve({ token: 'mock-jwt-token', user: { name: email.split('@')[0], email } })
      } else {
        reject(new Error('Invalid credentials'))
      }
    }, 800)
  })
}

export async function apiRegister(name, email, password) { 
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name && email && password) {
        resolve({ token: 'mock-jwt-token', user: { name, email } })
      } else {
        reject(new Error('Registration failed'))
      }
    }, 800)
  })
}

// ------------------------------------
// Mock Services endpoints
// ------------------------------------
export async function getServices() {
  return MOCK_SERVICES
}

export async function getService(serviceName) {
  return MOCK_SERVICES.find(s => s.id === serviceName) || null
}

export async function getSubService(serviceId, subServiceId) {
  return MOCK_SUB_SERVICES[serviceId]?.[subServiceId] || null
}

// ------------------------------------
// Mock Document endpoints
// ------------------------------------
export async function apiUpload(file) {
  return new Promise((resolve) => setTimeout(resolve, 800))
}

export async function apiValidate(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sizeValid: file.size <= 2 * 1024 * 1024,
        formatValid: true,
        sizeKB: (file.size / 1024).toFixed(1),
        format: file.name.split('.').pop().toUpperCase()
      })
    }, 1000)
  })
}

export async function apiFormat(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let verb = action
      if (action === 'compress') verb = 'compressed'
      if (action === 'convert') verb = 'converted'
      if (action === 'resize') verb = 'resized'
      resolve({ message: `Document successfully ${verb}` })
    }, 1200)
  })
}
