import asyncio
from backend.database import services_collection, subservices_collection

SERVICES_DATA = {
  'aadhaar': {
    'id': 'aadhaar',
    'title': 'Aadhaar',
    'subtitle': 'Check your Aadhaar card services steps here',
    'icon': '🪪',
    'time': '15–20 days',
    'fee': '₹50',
    'portalName': 'UIDAI Portal',
    'portalLink': 'https://uidai.gov.in/',
    'steps': [
      { 'title': 'Visit Aadhaar Seva Kendra', 'desc': 'Locate the nearest Aadhaar Seva Kendra or book an appointment online at uidai.gov.in.' },
      { 'title': 'Fill the update form', 'desc': 'Collect and fill Form 1 (Aadhaar Update/Correction form) with the correct details.' },
      { 'title': 'Submit biometrics', 'desc': 'Provide fingerprints and iris scan at the center to verify your identity.' },
      { 'title': 'Pay the update fee', 'desc': 'Pay ₹50 as the processing fee via cash or card at the center.' },
      { 'title': 'Collect acknowledgement slip', 'desc': 'Receive an acknowledgement slip with an Update Request Number (URN).' },
      { 'title': 'Track your request', 'desc': 'Track the status using URN on the UIDAI portal. Updated Aadhaar arrives in 15–20 working days.' },
    ],
    'docs': [
      { 'name': 'Proof of Identity', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      { 'name': 'Existing Aadhaar Card', 'format': 'PDF/JPG', 'size': 'Max 1MB' },
      { 'name': 'Filled Update Form', 'format': 'PDF', 'size': 'Max 500KB' },
    ],
  },
  'pan': {
    'id': 'pan',
    'title': 'PAN Card Application',
    'subtitle': 'Apply for a new or duplicate PAN card',
    'icon': '💳',
    'time': '15–20 days',
    'fee': '₹93',
    'portalName': 'NSDL Portal',
    'portalLink': 'https://www.onlineservices.nsdl.com/',
    'steps': [
      { 'title': 'Visit NSDL or UTIITSL portal', 'desc': 'Go to onlineservices.nsdl.com or utiitsl.com to start your PAN application.' },
      { 'title': 'Select application type', 'desc': 'Choose Form 49A (Indian citizens) or 49AA (foreign nationals).' },
      { 'title': 'Fill the application form', 'desc': 'Enter all personal, address, and source-of-income details accurately.' },
      { 'title': 'Upload documents', 'desc': 'Upload scanned copies of proof of identity, address, and date of birth.' },
      { 'title': 'Pay processing fee', 'desc': 'Pay ₹93 for Indian address delivery via net banking or card.' },
      { 'title': 'Submit and note acknowledgement', 'desc': 'Submit the form and note the 15-digit acknowledgement number.' },
      { 'title': 'Physical form submission', 'desc': 'Print, sign, and courier the acknowledgement form to NSDL if not using digital signature.' },
    ],
    'docs': [
      { 'name': 'Proof of Identity', 'format': 'PDF/JPG', 'size': 'Max 300KB' },
      { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 300KB' },
      { 'name': 'Proof of Date of Birth', 'format': 'PDF/JPG', 'size': 'Max 300KB' },
      { 'name': 'Passport-size Photo', 'format': 'JPG/PNG', 'size': 'Max 100KB' },
    ],
  },
  'passport': {
    'id': 'passport',
    'title': 'Passport Application',
    'subtitle': 'Apply for a fresh or reissue passport',
    'icon': '🛂',
    'time': '30–45 days',
    'fee': '₹1500',
    'portalName': 'Passport Seva',
    'portalLink': 'https://www.passportindia.gov.in/',
    'steps': [
      { 'title': 'Register at Passport Seva', 'desc': 'Create an account at passportindia.gov.in and fill out the online application.' },
      { 'title': 'Fill application form', 'desc': 'Complete Form SP-1 online with all personal details accurately.' },
      { 'title': 'Pay application fee', 'desc': 'Pay ₹1500 for fresh passport or ₹1000 for reissue via net banking or card.' },
      { 'title': 'Schedule appointment', 'desc': 'Book a slot at the nearest Passport Seva Kendra (PSK) or POPSK.' },
      { 'title': 'Visit PSK with documents', 'desc': 'Appear at PSK on the scheduled date with all original documents.' },
      { 'title': 'Police verification', 'desc': 'Police verification will be conducted at your address. Ensure availability.' },
      { 'title': 'Receive passport', 'desc': 'Passport will be dispatched to your address via Speed Post.' },
    ],
    'docs': [
      { 'name': 'Proof of Date of Birth', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      { 'name': 'Existing Passport (if reissue)', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      { 'name': 'Passport-size Photographs', 'format': 'JPG/PNG', 'size': 'Max 100KB' },
    ],
  },
  'driving': {
    'id': 'driving',
    'title': 'Driving License Renewal',
    'subtitle': 'Renew your motor vehicle driving licence',
    'icon': '🚗',
    'time': '7–10 days',
    'fee': '₹200',
    'portalName': 'Parivahan Portal',
    'portalLink': 'https://parivahan.gov.in/',
    'steps': [
      { 'title': 'Log in to Parivahan portal', 'desc': 'Visit parivahan.gov.in and log in or register as a new user.' },
      { 'title': 'Select licence renewal', 'desc': 'Go to "Driving Licence" → "Apply for DL Renewal" and enter your existing DL number.' },
      { 'title': 'Fill application form', 'desc': 'Fill Form 9 online with personal and vehicle category details.' },
      { 'title': 'Upload documents', 'desc': 'Upload current DL, address proof, and medical certificate (Form 1A).' },
      { 'title': 'Pay fee online', 'desc': 'Pay the renewal fee of ₹200 via net banking, UPI, or debit/credit card.' },
      { 'title': 'Book RTO appointment', 'desc': 'Book an appointment at your nearest RTO for verification if required.' },
      { 'title': 'Collect renewed licence', 'desc': 'Your renewed licence will be delivered to your registered address.' },
    ],
    'docs': [
      { 'name': 'Existing Driving Licence', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      { 'name': 'Address Proof', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      { 'name': 'Medical Certificate (Form 1A)', 'format': 'PDF', 'size': 'Max 2MB' },
      { 'name': 'Passport-size Photo', 'format': 'JPG/PNG', 'size': 'Max 100KB' },
      { 'name': 'Applicant Signature', 'format': 'JPG/PNG', 'size': 'Max 100KB' },
    ],
  },
  'patta-document': {
    'id': 'patta-document',
    'title': 'Patta Document',
    'subtitle': 'Manage Patta application and ownership transfer',
    'icon': '📜',
    'time': '10–15 days',
    'fee': '₹100',
    'portalName': 'Tamil Nilam Portal',
    'portalLink': 'https://tamilnilam.tn.gov.in/citizen/',
    'steps': [
      { 'title': 'Open Patta service', 'desc': 'Visit the Patta portal and choose the required service.' },
      { 'title': 'Choose application type', 'desc': 'Select New Patta or Name Transfer.' },
      { 'title': 'Fill property details', 'desc': 'Enter property and owner information accurately.' },
      { 'title': 'Upload documents', 'desc': 'Provide land records, ID proof, and tax documents.' },
      { 'title': 'Pay the fee', 'desc': 'Complete the processing fee payment online or at the office.' },
      { 'title': 'Submit application', 'desc': 'Submit and note the reference number for tracking.' },
    ],
    'docs': [
      { 'name': 'Property documents', 'format': 'PDF/JPG', 'size': 'Max 5MB' },
      { 'name': 'Identity proof', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      { 'name': 'Tax receipt or rent agreement', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      { 'name': 'Survey sketch / plan', 'format': 'PDF/JPG', 'size': 'Max 5MB' },
    ],
  },
}

SUBSERVICES_DATA = {
  'aadhaar': {
    'get-aadhaar': {
      'title': 'Get Aadhaar',
      'steps': [
        { 'title': 'Locate an Enrolment Center', 'desc': 'Find your nearest Aadhaar Seva Kendra.' },
        { 'title': 'Book an Appointment', 'desc': 'Book an appointment online.' },
        { 'title': 'Visit the Center', 'desc': 'Go to the center with required documents.' },
      ],
      'docs': [
        { 'name': 'Proof of Identity', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://myaadhaar.uidai.gov.in/',
      'portalName': 'myAadhaar Portal',
    },
    'update-aadhaar': {
      'title': 'Update Aadhaar',
      'steps': [
        { 'title': 'Login', 'desc': 'Login to the myAadhaar portal using Aadhaar number and OTP.' },
        { 'title': 'Select Update Type', 'desc': 'Choose what you want to update (Address, Mobile, etc.).' },
        { 'title': 'Upload Documents', 'desc': 'Upload the required valid proof documents.' },
        { 'title': 'Submit & Pay', 'desc': 'Submit the request and pay the fee if applicable.' },
      ],
      'docs': [
        { 'name': 'Proof of Identity', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://myaadhaar.uidai.gov.in/',
      'portalName': 'myAadhaar Portal',
    },
  },
  'driving': {
    'learners-license': {
      'title': 'Learner\'s License',
      'steps': [
        { 'title': 'Apply Online', 'desc': 'Fill the application form on Parivahan Sewa.' },
        { 'title': 'Upload Documents', 'desc': 'Upload photo, signature, and required proofs.' },
        { 'title': 'Fee Payment', 'desc': 'Pay the required application fee.' },
        { 'title': 'LL Test Slot Booking', 'desc': 'Book a slot for the Learner\'s License test.' },
      ],
      'docs': [
        { 'name': 'Age Proof', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Address Proof', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://parivahan.gov.in/parivahan/',
      'portalName': 'Parivahan Sewa Portal',
    },
    'driving-school': {
      'title': 'Driving School',
      'steps': [
        { 'title': 'Find a School', 'desc': 'Search for authorized accredited driving schools.' },
        { 'title': 'Enroll', 'desc': 'Register with the selected driving school.' },
        { 'title': 'Training', 'desc': 'Complete the required training course.' },
        { 'title': 'Certificate', 'desc': 'Receive your training certificate.' },
      ],
      'docs': [
        { 'name': 'ID Proof', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://parivahan.gov.in/parivahan/',
      'portalName': 'Parivahan Sewa Portal',
    },
    'online-test': {
      'title': 'Online Test / Appointment',
      'steps': [
        { 'title': 'Login', 'desc': 'Access the Parivahan portal with your application details.' },
        { 'title': 'Select Slot', 'desc': 'Choose an available time slot for your test.' },
        { 'title': 'Take Test', 'desc': 'Appear for the online or in-person driving knowledge test.' },
      ],
      'docs': [
        { 'name': 'Application Form', 'format': 'PDF', 'size': 'Max 2MB' },
        { 'name': 'Learner License (if applicable)', 'format': 'PDF', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://parivahan.gov.in/parivahan/',
      'portalName': 'Parivahan Sewa Portal',
    },
    'other-services': {
      'title': 'Other Services',
      'steps': [
        { 'title': 'Select Service', 'desc': 'Choose the specific service like address change or duplicate license.' },
        { 'title': 'Fill Form & Upload', 'desc': 'Provide necessary details and supporting documents.' },
        { 'title': 'Submit & Pay', 'desc': 'Complete the submission and pay fees if applicable.' },
      ],
      'docs': [
        { 'name': 'Original License', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Relevant Proofs', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://parivahan.gov.in/parivahan/',
      'portalName': 'Parivahan Sewa Portal',
    },
  },
  'passport': {
    'new-passport': {
      'title': 'New Passport',
      'steps': [
        { 'title': 'Register', 'desc': 'Register yourself on the Passport Seva Online Portal.' },
        { 'title': 'Apply', 'desc': 'Click on "Apply for Fresh Passport/Re-issue of Passport" link.' },
        { 'title': 'Payment & Appointment', 'desc': 'Pay the fee and book your appointment.' },
        { 'title': 'Visit PSK', 'desc': 'Visit the Passport Seva Kendra (PSK) with original documents.' },
      ],
      'docs': [
        { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Proof of Date of Birth', 'format': 'PDF', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://www.passportindia.gov.in/',
      'portalName': 'Passport Seva Kendra',
    },
    'passport-renewal': {
      'title': 'Passport Renewal',
      'steps': [
        { 'title': 'Register', 'desc': 'Register yourself on the Passport Seva Online Portal.' },
        { 'title': 'Apply', 'desc': 'Click on "Apply for Fresh Passport/Re-issue of Passport" link.' },
        { 'title': 'Payment & Appointment', 'desc': 'Pay the fee and book your appointment.' },
        { 'title': 'Visit PSK', 'desc': 'Visit the Passport Seva Kendra (PSK) with original documents.' },
      ],
      'docs': [
        { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Proof of Date of Birth', 'format': 'PDF', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://www.passportindia.gov.in/',
      'portalName': 'Passport Seva Kendra',
    },
    'lost-damage': {
      'title': 'Lost/Stolen/Damaged Passport',
      'steps': [
        { 'title': 'Register', 'desc': 'Register yourself on the Passport Seva Online Portal.' },
        { 'title': 'Apply', 'desc': 'Click on "Apply for Fresh Passport/Re-issue of Passport" link.' },
        { 'title': 'Payment & Appointment', 'desc': 'Pay the fee and book your appointment.' },
        { 'title': 'Visit PSK', 'desc': 'Visit the Passport Seva Kendra (PSK) with original documents.' },
      ],
      'docs': [
        { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Proof of Date of Birth', 'format': 'PDF', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://www.passportindia.gov.in/',
      'portalName': 'Passport Seva Kendra',
    },
    'other-services': {
      'title': 'Other Services',
      'steps': [
        { 'title': 'Register', 'desc': 'Register yourself on the Passport Seva Online Portal.' },
        { 'title': 'Apply', 'desc': 'Click on "Apply for Fresh Passport/Re-issue of Passport" link.' },
        { 'title': 'Payment & Appointment', 'desc': 'Pay the fee and book your appointment.' },
        { 'title': 'Visit PSK', 'desc': 'Visit the Passport Seva Kendra (PSK) with original documents.' },
      ],
      'docs': [
        { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Proof of Date of Birth', 'format': 'PDF', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://www.passportindia.gov.in/',
      'portalName': 'Passport Seva Kendra',
    },
  },
  'patta-document': {
    'new-patta': {
      'title': 'New Patta',
      'steps': [
        { 'title': 'Prepare Documents', 'desc': 'Collect required documents like sale deed, property tax receipts, EC (Encumbrance Certificate), and ID proof.' },
        { 'title': 'Visit Taluk Office / VAO', 'desc': 'Go to your local Taluk Office or Village Administrative Officer (VAO) office where the property is located.' },
        { 'title': 'Submit Application', 'desc': 'Fill out the Patta transfer/new Patta application form and submit it along with all required documents.' },
        { 'title': 'Verification Process', 'desc': 'Officials will verify your documents and may conduct a field inspection of the property.' },
        { 'title': 'Approval by Tahsildar', 'desc': 'After verification, the Tahsildar reviews and approves the Patta request.' },
        { 'title': 'Receive Patta', 'desc': 'Once approved, the Patta document is issued and can be collected from the office or accessed online if available.' },
      ],
      'docs': [
        { 'name': 'Proof of Identity', 'format': 'JPG', 'size': 'Max 400KB' },
        { 'name': 'Proof of Address', 'format': 'JPG', 'size': 'Max 400KB' },
        { 'name': 'Parent Document of Land', 'format': 'JPG', 'size': 'Max 400KB' },
        { 'name': 'Previous patta document', 'format': 'JPG', 'size': 'Max 400KB' },
        { 'name': 'Sale Deed', 'format': 'JPG', 'size': 'Max 400KB' },
        { 'name': 'Encumbrance Certificate (EC)', 'format': 'JPG', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://tamilnilam.tn.gov.in/citizen/',
      'portalName': 'Tamil Nilam Portal',
    },
    'patta-name-transfer': {
      'title': 'Patta Name Transfer',
      'steps': [
        { 'title': 'Register / Login', 'desc': 'Create an account or log in on the Tamil Nadu e-Services (Tamil Nilam) portal using your mobile number and OTP.' },
        { 'title': 'Select Patta Transfer Service', 'desc': 'Choose the "Patta Transfer" or "Patta Name Change" option from the land services section.' },
        { 'title': 'Fill Application Details', 'desc': 'Enter property details such as district, taluk, village, survey number, and details of buyer/seller.' },
        { 'title': 'Upload Documents', 'desc': 'Upload required documents like Sale Deed, Encumbrance Certificate (EC), identity proof, and supporting records.' },
        { 'title': 'Submit & Pay Fee', 'desc': 'Submit the application and pay the required processing fee online.' },
        { 'title': 'Application Processing', 'desc': 'Authorities will verify documents and may conduct field verification if needed.' },
        { 'title': 'Track & Download Patta', 'desc': 'Track your application status online and download the updated Patta once approved.' },
      ],
      'docs': [
        { 'name': 'Proof of Identity', 'format': 'JPG', 'size': 'Max 400KB' },
        { 'name': 'Proof of Address', 'format': 'JPG', 'size': 'Max 400KB' },
        { 'name': 'Parent Document of Land', 'format': 'JPG', 'size': 'Max 400KB' },
        { 'name': 'Previous patta document', 'format': 'JPG', 'size': 'Max 400KB' },
        { 'name': 'Sale Deed', 'format': 'JPG', 'size': 'Max 400KB' },
        { 'name': 'Encumbrance Certificate (EC)', 'format': 'JPG', 'size': 'Max 2MB' },
      ],
      'portalLink': 'https://tamilnilam.tn.gov.in/citizen/',
      'portalName': 'Tamil Nilam Portal',
    },
  },
}

async def migrate():
    # Insert Services
    print("Clearing old data...")
    await services_collection.delete_many({})
    await subservices_collection.delete_many({})
    
    print("Inserting Services...")
    for s_id, s_data in SERVICES_DATA.items():
        doc = dict(s_data)
        doc['_id'] = s_id
        await services_collection.insert_one(doc)
    
    print("Inserting Subservices...")
    for s_id, sub_data in SUBSERVICES_DATA.items():
        for sub_id, data in sub_data.items():
            doc = dict(data)
            doc['service_id'] = s_id
            doc['subservice_id'] = sub_id
            doc['_id'] = f"{s_id}_{sub_id}"
            await subservices_collection.insert_one(doc)
            
    print("Migration complete!")

if __name__ == "__main__":
    asyncio.run(migrate())
