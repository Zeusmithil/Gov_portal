import asyncio
from database import subservices_collection, client

MOCK_SUB_SERVICES = {
  'aadhaar': {
    'get-aadhaar': {
      'title': 'Get Aadhaar',
      'steps': [
        { 'title': 'Locate an Enrolment Center', 'desc': 'Find your nearest Aadhaar Seva Kendra.' },
        { 'title': 'Book an Appointment', 'desc': 'Book an appointment online.' },
        { 'title': 'Visit the Center', 'desc': 'Go to the center with required documents.' }
      ],
      'docs': [
        { 'name': 'Proof of Identity', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 2MB' }
      ],
      'portalLink': 'https://myaadhaar.uidai.gov.in/',
      'portalName': 'myAadhaar Portal'
    },
    'update-aadhaar': {
      'title': 'Update Aadhaar',
      'steps': [
        { 'title': 'Login', 'desc': 'Login to the myAadhaar portal using Aadhaar number and OTP.' },
        { 'title': 'Select Update Type', 'desc': 'Choose what you want to update (Address, Mobile, etc.).' },
        { 'title': 'Upload Documents', 'desc': 'Upload the required valid proof documents.' },
        { 'title': 'Submit & Pay', 'desc': 'Submit the request and pay the fee if applicable.' }
      ],
      'docs': [
        { 'name': 'Proof of Identity', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Proof of Address', 'format': 'PDF/JPG', 'size': 'Max 2MB' }
      ],
      'portalLink': 'https://myaadhaar.uidai.gov.in/',
      'portalName': 'myAadhaar Portal'
    }
  },
  'driving': {
    'learners-license': {
      'title': 'Learner\'s License',
      'steps': [
        { 'title': 'Apply Online', 'desc': 'Fill the application form on Parivahan Sewa.' },
        { 'title': 'Upload Documents', 'desc': 'Upload photo, signature, and required proofs.' },
        { 'title': 'Fee Payment', 'desc': 'Pay the required application fee.' },
        { 'title': 'LL Test Slot Booking', 'desc': 'Book a slot for the Learner\'s License test.' }
      ],
      'docs': [
        { 'name': 'Age Proof', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Address Proof', 'format': 'PDF/JPG', 'size': 'Max 2MB' }
      ],
      'portalLink': 'https://parivahan.gov.in/parivahan/',
      'portalName': 'Parivahan Sewa Portal'
    },
    'driving-school': {
      'title': 'Driving School',
      'steps': [
        { 'title': 'Find a School', 'desc': 'Search for authorized accredited driving schools.' },
        { 'title': 'Enroll', 'desc': 'Register with the selected driving school.' },
        { 'title': 'Training', 'desc': 'Complete the required training course.' },
        { 'title': 'Certificate', 'desc': 'Receive your training certificate.' }
      ],
      'docs': [
        { 'name': 'ID Proof', 'format': 'PDF/JPG', 'size': 'Max 2MB' }
      ],
      'portalLink': 'https://parivahan.gov.in/parivahan/',
      'portalName': 'Parivahan Sewa Portal'
    },
    'online-test': {
      'title': 'Online Test / Appointment',
      'steps': [
        { 'title': 'Login', 'desc': 'Access the Parivahan portal with your application details.' },
        { 'title': 'Select Slot', 'desc': 'Choose an available time slot for your test.' },
        { 'title': 'Take Test', 'desc': 'Appear for the online or in-person driving knowledge test.' }
      ],
      'docs': [
        { 'name': 'Application Form', 'format': 'PDF', 'size': 'Max 2MB' },
        { 'name': 'Learner License (if applicable)', 'format': 'PDF', 'size': 'Max 2MB' }
      ],
      'portalLink': 'https://parivahan.gov.in/parivahan/',
      'portalName': 'Parivahan Sewa Portal'
    },
    'other-services': {
      'title': 'Other Services',
      'steps': [
        { 'title': 'Select Service', 'desc': 'Choose the specific service like address change or duplicate license.' },
        { 'title': 'Fill Form & Upload', 'desc': 'Provide necessary details and supporting documents.' },
        { 'title': 'Submit & Pay', 'desc': 'Complete the submission and pay fees if applicable.' }
      ],
      'docs': [
        { 'name': 'Original License', 'format': 'PDF/JPG', 'size': 'Max 2MB' },
        { 'name': 'Relevant Proofs', 'format': 'PDF/JPG', 'size': 'Max 2MB' }
      ],
      'portalLink': 'https://parivahan.gov.in/parivahan/',
      'portalName': 'Parivahan Sewa Portal'
    }
  },
  'passport':{
      'new-passport':{
        'title':'New Passport',
        'steps':[
          {'title':'Register','desc':'Register yourself on the Passport Seva Online Portal.'},
          {'title':'Apply','desc':'Click on "Apply for Fresh Passport/Re-issue of Passport" link.'},
          {'title':'Payment & Appointment','desc':'Pay the fee and book your appointment.'},
          {'title':'Visit PSK','desc':'Visit the Passport Seva Kendra (PSK) with original documents.'}
        ],
        'docs':[
          {'name':'Proof of Address','format':'PDF/JPG','size':'Max 2MB'},
          {'name':'Proof of Date of Birth','format':'PDF','size':'Max 2MB'}
        ],
        'portalLink':'https://www.passportindia.gov.in/',
        'portalName':'Passport Seva Kendra'
      },
      'passport-renewal':{
        'title':'Passport Renewal',
        'steps':[
          {'title':'Register','desc':'Register yourself on the Passport Seva Online Portal.'},
          {'title':'Apply','desc':'Click on "Apply for Fresh Passport/Re-issue of Passport" link.'},
          {'title':'Payment & Appointment','desc':'Pay the fee and book your appointment.'},
          {'title':'Visit PSK','desc':'Visit the Passport Seva Kendra (PSK) with original documents.'}
        ],
        'docs':[
          {'name':'Proof of Address','format':'PDF/JPG','size':'Max 2MB'},
          {'name':'Proof of Date of Birth','format':'PDF','size':'Max 2MB'}
        ],
        'portalLink':'https://www.passportindia.gov.in/',
        'portalName':'Passport Seva Kendra'
      },
      'lost-damage':{
        'title':'Lost/Stolen/Damaged Passport',
        'steps':[
          {'title':'Register','desc':'Register yourself on the Passport Seva Online Portal.'},
          {'title':'Apply','desc':'Click on "Apply for Fresh Passport/Re-issue of Passport" link.'},
          {'title':'Payment & Appointment','desc':'Pay the fee and book your appointment.'},
          {'title':'Visit PSK','desc':'Visit the Passport Seva Kendra (PSK) with original documents.'}
        ],
        'docs':[
          {'name':'Proof of Address','format':'PDF/JPG','size':'Max 2MB'},
          {'name':'Proof of Date of Birth','format':'PDF','size':'Max 2MB'}
        ],
        'portalLink':'https://www.passportindia.gov.in/',
        'portalName':'Passport Seva Kendra'
      },
      'other-services':{
        'title':'Other Services',
        'steps':[
          {'title':'Register','desc':'Register yourself on the Passport Seva Online Portal.'},
          {'title':'Apply','desc':'Click on "Apply for Fresh Passport/Re-issue of Passport" link.'},
          {'title':'Payment & Appointment','desc':'Pay the fee and book your appointment.'},
          {'title':'Visit PSK','desc':'Visit the Passport Seva Kendra (PSK) with original documents.'}
        ],
        'docs':[
          {'name':'Proof of Address','format':'PDF/JPG','size':'Max 2MB'},
          {'name':'Proof of Date of Birth','format':'PDF','size':'Max 2MB'}
        ],
        'portalLink':'https://www.passportindia.gov.in/',
        'portalName':'Passport Seva Kendra'
      }
    },
    'patta-document' : {
      'new-patta' : {
        'title':'New Patta',
        'steps': [
          {'title': 'Prepare Documents', 'desc': 'Collect required documents like sale deed, property tax receipts, EC (Encumbrance Certificate), and ID proof.'},
          {'title': 'Visit Taluk Office / VAO', 'desc': 'Go to your local Taluk Office or Village Administrative Officer (VAO) office where the property is located.'},
          {'title': 'Submit Application', 'desc': 'Fill out the Patta transfer/new Patta application form and submit it along with all required documents.'},
          {'title': 'Verification Process', 'desc': 'Officials will verify your documents and may conduct a field inspection of the property.'},
          {'title': 'Approval by Tahsildar', 'desc': 'After verification, the Tahsildar reviews and approves the Patta request.'},
          {'title': 'Receive Patta', 'desc': 'Once approved, the Patta document is issued and can be collected from the office or accessed online if available.'}
        ],
        'docs':[
          {'name':'Proof of Identity','format':'JPG','size':'Max 400KB'},
          {'name':'Proof of Address','format':'JPG','size':'Max 400KB'},
          {'name':'Parent Document of Land','format':'JPG','size':'Max 400KB'},
          {'name':'Previous patta document','format':'JPG','size':'Max 400KB'},
          {'name':'Sale Deed','format':'JPG','size':'Max 400KB'},
          {'name': 'Encumbrance Certificate (EC)', 'format': 'JPG', 'size': 'Max 2MB' }
        ],
        'portalLink':'https://tamilnilam.tn.gov.in/citizen/',
        'portalName':'Tamil Nilam Portal'
      },
      'patta-name-transfer':{
        'title':'Patta Name Transfer',
        'steps': [
          {'title': 'Register / Login', 'desc': 'Create an account or log in on the Tamil Nadu e-Services (Tamil Nilam) portal using your mobile number and OTP.'},
          {'title': 'Select Patta Transfer Service', 'desc': 'Choose the "Patta Transfer" or "Patta Name Change" option from the land services section.'},
          {'title': 'Fill Application Details', 'desc': 'Enter property details such as district, taluk, village, survey number, and details of buyer/seller.'},
          {'title': 'Upload Documents', 'desc': 'Upload required documents like Sale Deed, Encumbrance Certificate (EC), identity proof, and supporting records.'},
          {'title': 'Submit & Pay Fee', 'desc': 'Submit the application and pay the required processing fee online.'},
          {'title': 'Application Processing', 'desc': 'Authorities will verify documents and may conduct field verification if needed.'},
          {'title': 'Track & Download Patta', 'desc': 'Track your application status online and download the updated Patta once approved.'}
        ],
        'docs':[
          {'name':'Proof of Identity','format':'JPG','size':'Max 400KB'},
          {'name':'Proof of Address','format':'JPG','size':'Max 400KB'},
          {'name':'Parent Document of Land','format':'JPG','size':'Max 400KB'},
          {'name':'Previous patta document','format':'JPG','size':'Max 400KB'},
          {'name':'Sale Deed','format':'JPG','size':'Max 400KB'},
          {'name': 'Encumbrance Certificate (EC)', 'format': 'JPG', 'size': 'Max 2MB' }
        ],
        'portalLink':'https://tamilnilam.tn.gov.in/citizen/',
        'portalName':'Tamil Nilam Portal'
      } 
    }
}

async def seed_subservices():
    print("🌱 Connecting to MongoDB...")
    await subservices_collection.delete_many({})
    
    docs_to_insert = []
    for service_id, subservices in MOCK_SUB_SERVICES.items():
        for sub_id, data in subservices.items():
            doc = {
                "serviceId": service_id,
                "subServiceId": sub_id,
                "title": data["title"],
                "steps": data["steps"],
                "docs": data["docs"],
                "portalLink": data.get("portalLink", ""),
                "portalName": data.get("portalName", "")
            }
            docs_to_insert.append(doc)
            
    result = await subservices_collection.insert_many(docs_to_insert)
    print(f"✅ Successfully inserted {len(result.inserted_ids)} sub-services into MongoDB!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_subservices())
