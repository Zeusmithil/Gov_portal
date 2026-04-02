import asyncio
from database import services_collection, client

MOCK_SERVICES = [
  {
    "id": "aadhaar",
    "icon": "🪪",
    "title": "Aadhaar Services",
    "subtitle": "Apply, update, or download your Aadhaar card",
    "time": "5-10 mins",
    "fee": "Free / ₹50",
    "portalLink": "https://myaadhaar.uidai.gov.in/",
    "portalName": "myAadhaar Portal",
    "docs": [
      { "name": "Proof of Identity", "format": "PDF/JPG", "size": "Max 2MB" },
      { "name": "Proof of Address", "format": "PDF/JPG", "size": "Max 2MB" },
      { "name": "Proof of Date of Birth", "format": "PDF/JPG", "size": "Max 2MB" }
    ],
    "steps": []
  },
  {
    "id": "driving",
    "icon": "🚗",
    "title": "Driving License",
    "subtitle": "Learner's, permanent, or renewal of license",
    "time": "15-20 mins",
    "fee": "₹200 - ₹1000",
    "portalLink": "https://parivahan.gov.in/parivahan/",
    "portalName": "Parivahan Sewa Portal",
    "docs": [
      { "name": "Age Proof", "format": "PDF/JPG", "size": "Max 2MB" },
      { "name": "Address Proof", "format": "PDF/JPG", "size": "Max 2MB" },
      { "name": "Passport Size Photograph", "format": "JPG", "size": "Max 50KB" }
    ],
    "steps": []
  },
  {
    "id": "pan",
    "icon": "💳",
    "title": "PAN Card Services",
    "subtitle": "Apply for a new PAN card or update existing details",
    "time": "15-20 mins",
    "fee": "₹107 - ₹1017",
    "portalLink": "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    "portalName": "NSDL PAN Portal",
    "docs": [
      { "name": "Proof of Identity", "format": "PDF/JPG", "size": "Max 2MB" },
      { "name": "Proof of Address", "format": "PDF/JPG", "size": "Max 2MB" },
      { "name": "Proof of Date of Birth", "format": "PDF/JPG", "size": "Max 2MB" },
      { "name": "Passport Size Photograph", "format": "JPG", "size": "Max 50KB" }
    ],
    "steps": [
      { "title": "Fill Application", "desc": "Fill the Form 49A (for Indian citizens) on the NSDL or UTIITSL website." },
      { "title": "Upload Documents", "desc": "Scan and upload your photograph, signature, and supporting documents." },
      { "title": "Pay Fee", "desc": "Pay the application fee via accepted online payment modes." },
      { "title": "e-Sign / Send Docs", "desc": "Authenticate via Aadhaar e-KYC or physically post documents to NSDL/UTIITSL." }
    ]
  },
  {
    "id": "passport",
    "icon": "🛂",
    "title": "Passport Services",
    "subtitle": "New passport, renewal, or police clearance",
    "time": "20-30 mins",
    "fee": "₹1500 - ₹2000",
    "portalLink": "https://www.passportindia.gov.in/",
    "portalName": "Passport Seva Kendra",
    "docs": [
      { "name": "Proof of Address", "format": "PDF/JPG", "size": "Max 2MB" },
      { "name": "Proof of Date of Birth", "format": "PDF", "size": "Max 2MB" }
    ],
    "steps": []
  },
  {
    "id": "patta-document",
    "icon": "📄",
    "title": "Patta Document",
    "subtitle": "Apply for transfering the patta document",
    "time": "1-2 days",
    "fee": "according to the services",
    "portalLink": "https://tamilnilam.tn.gov.in/citizen/",
    "portalName": "Tamil Nilam Portal",
    "docs": [
      { "name": "Proof of Identity", "format": "JPG", "size": "Max 400KB" },
      { "name": "Proof of Address", "format": "JPG", "size": "Max 400KB" },
      { "name": "Parent Document of Land", "format": "JPG", "size": "Max 400KB" },
      { "name": "Previous patta document", "format": "JPG", "size": "Max 400KB" },
      { "name": "Sale Deed", "format": "JPG", "size": "Max 400KB" },
      { "name": "Encumbrance Certificate (EC)", "format": "JPG", "size": "Max 2MB" }
    ],
    "steps": []
  }
]

async def seed_db():
    print("🌱 Connecting to MongoDB...")
    # Clear out the collection so we don't accidentally insert it twice!
    await services_collection.delete_many({})
    print("🗑️  Cleared existing services from database to start fresh.")
    
    # Insert the mock services
    result = await services_collection.insert_many(MOCK_SERVICES)
    print(f"✅ Successfully inserted {len(result.inserted_ids)} services into MongoDB!")
    
    # Close the database connection
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_db())
