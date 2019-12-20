//Job to upsert Account, Contact, and Form records in Salesforce on submission of GoogleForms
//Upsert Account records
upsert(
  'Account',
  'Organization_ID__c', //upsert via ExternalId that = Org Name + Website
  fields(
    //field('Organization_ID__c', 'Reading Rainbowhttp:wwwbooksaregreatorg'),
    field('Organization_ID__c', state => { //creating a OrgId = Name+Website
      var orgName = state.data.OrgName.toString().replace(/\//g," ");
      var website = (state.data.Website===null || state.data.Website===undefined? '' : state.data.Website.toString().replace(/\//g," "))
      var id = orgName + website;
      return id;
    }),
    //Mapping values from Google Form
    field('Name', dataValue('OrgName')),
    field('Phone', dataValue('Phone')),
    field('BillingStreet', dataValue('AddressStreet')),
    field('BillingCity', dataValue('AddressCity')),
    field('BillingCountry', dataValue('AddressCountry')),
    field('Website', dataValue('Website')),
    field('Inserted_via_OpenFn__c', true), //Hardcoded to mark checkbox as True
    field('RecordTypeId', '012o00000011MCNAA2'), //Hardcoded RT Id
    field('Type', 'Applicant') //Hardcoded Account Type
  )
);
//Upsert Contact records
upsert(
  'Contact',
  'Contact_ID__c', //upsert via Contact ExternalId that is a concatenation of OrgName + Email
  fields(
    field('Contact_ID__c', state =>{ //custom function to create new Contact ID for looking up existing Contacts
      var email = dataValue('ContactEmail')(state);
      var orgName = dataValue('OrgName')(state);
      var id = orgName + email; //returns new ID = OrgName + Email
      return id;
    }),
    field('Inserted_via_OpenFn__c', true), //Hardcoded to mark checkbox as True
    field('Email', dataValue('ContactEmail')),
    field('FirstName', state => {
      var first = dataValue('ContactName')(state).split(' ');
      return first.slice(0, -1).join(' '); //returns First Name(s)
    }),
    field('LastName', state => {
      var last = dataValue('ContactName')(state).split(' ');
      return last.slice(-1).join(' '); //returns Last Name only (so the last name specified if person has multi-names)
    }),
    field('Phone', dataValue('ContactPhone')),
    field('Is_Primary_Contact__c', true),
    relationship('Account', 'Organization_ID__c', state => {
      var orgName = state.data.OrgName.toString().replace(/\//g," ");
      var website = (state.data.Website===null || state.data.Website===undefined? '' : state.data.Website.toString().replace(/\//g," "))
      var id = orgName + website;
      return id;
    })
  )
);
//Upsert Form application records
upsert(
  'Form__c',
  'Google_Application_Id__c', //upsert via Google Form Id
  fields(
    field('Google_Application_Id__c', state => { //customId
      var id = 'SII2020-' + dataValue('Timestamp')(state); //concatenate App Name + Timestamp to create a uniqueId
      return id;
    }),
    relationship('Account__r', 'Organization_ID__c', state => {
      var orgName = state.data.OrgName.toString().replace(/\//g," ");
      var website = (state.data.Website===null || state.data.Website===undefined? '' : state.data.Website.toString().replace(/\//g," "))
      var id = orgName + website;
      return id;
    }),
    relationship('Reporting_Lead__r', 'Contact_ID__c', state =>{ //custom function to create new Contact ID for looking up existing Contacts
      var email = dataValue('ContactEmail')(state);
      var orgName = dataValue('OrgName')(state);
      var id = orgName + email; //returns new ID = OrgName + Email
      return id;
    }), //lookup to Contact created via the job
    field('RecordTypeId', '012o00000012N3mAAE'), //hardcoded RT if you want to set a default RT

    //======= Below mappings are for Google Form questions ======//
    field('Date_Submitted__c', dataValue('Timestamp')),
    field('Year_Registered__c', dataValue('YearRegistered')),
    field('Programmatic_Activities__c', state => {  //convert to multiselect - if you see "state", this means there is a custom function
      var act = dataValue('ProgActivities')(state);
      return (act !== null && act !== undefined ? act.toString().replace(/,/g, ';') : null);
    }),
    field('Demand_for_Services__c', dataValue('DemandServices')),
    field('Mission_Statement__c', dataValue('Mission')),
    field('Organization_Overview__c', dataValue('CoreActivities')),
    field('Active_Programming__c', dataValue('ActiveProgramming')),
    field('Paid_Full_time_Staff__c', dataValue('NumberStaff')),
    field('Women_s_Voices_Staff__c', dataValue('Responsibilities')),
    field('Other_Staff_unpaid_stipend_long_term__c', dataValue('NumberVolunteers')),
    field('X2018_Budget__c', dataValue('Budget2018')),
    field('X2019_Budget__c', dataValue('Budget2019')),
    field('X2020_Budget__c', dataValue('Budget2020')),
    field('Special_Sauce__c', dataValue('SpecialSauce')),
    field('Organizational_Needs__c', dataValue('OrgNeeds')),
    field('Capacity_Building_Priorities__c', dataValue('CapacityPriorities')),
    field('Other_Partnerships__c', dataValue('Networks')),
    field('Why_Apply__c', dataValue('WhyApply')),
    field('Expectations__c', dataValue('Expectations'))
    ////======= You can add field mappings if you introduce other Google Form questions =====////
    // field('SF_FieldName__c', dataValue('GoogleSourceValue'))
  )
);
