query(
  `SELECT Id FROM Account WHERE Name = '` +
    (state.data.OrgName || '') +
    (state.data.Website || '') +
    `'`
);

upsert(
  'Account',
  'Id',
  fields(
    field('Name', dataValue('OrgName')),
    field('Phone', dataValue('Phone')),
    field('Id', state => {
      return state.references[0].records[0].Id;
    }),
    field('BillingStreet', dataValue('AddressStreet')),
    field('BillingCity', dataValue('AddressCity')),
    field('BillingCountry', dataValue('AddressCountry')),
    field('Website', dataValue('Website'))
  )
);

upsert(
  'Contact',
  'Email',
  fields(
    //upsert via email
    field('FirstName', state => {
      var names = dataValue('ContactName')(state).split(' ');
      return names.slice(0, -1).join(' '); //returns firstName only
    }),
    field('LastName', state => {
      var names = dataValue('ContactName')(state).split(' ');
      return names.slice(-1).join(' '); //returns lastName only
    }),
    field('Email', dataValue('ContactEmail')),
    field('Phone', dataValue('ContactPhone')),
    field('Is_Primary_Contact__c', true),
    field('Account', state => {
      return state.references[1].records[0].Id; //see L20 - Account Id returned from query
    })
  )
);

upsert(
  'Form__c',
  'Google_Application_Id__c',
  fields(
    field('Google_Application_Id__c', state => {
      var id = 'SII2020-' + dataValue('Timestamp')(state); //concatenate App Name + Timestamp to create a uniqueId
      return id;
    }),
    relationship('Account__r', 'Organization_ID__c', 'Test Org'),
    relationship('Reporting_Lead__r', 'Email', dataValue('ContactEmail')),
    field('RecordTypeId', '012o00000012N3mAAE'), //hardcoded RT
    field('Date_Submitted__c', dataValue('Timestamp')),
    field('Year_Registered__c', dataValue('YearRegistered')),
    field('Programmatic_Activities__c', state => {
      //convert to multiselect
      var act = dataValue('ProgActivities')(state);
      return act !== null && act !== undefined
        ? act.toString().replace(/,/g, ';')
        : null;
    }),
    field('Demand_for_Services__c', dataValue('DemandServices')),
    field('Mission_Statement__c', dataValue('Mission')),
    field('Organization_Overview__c', dataValue('CoreActivities')),
    field('Active_Programming__c', dataValue('ActiveProgramming')),
    field('Paid_Full_time_Staff__c', dataValue('NumberStaff')),
    field('Women_s_Voices_Staff__c', dataValue('Responsibilities')),
    field(
      'Other_Staff_unpaid_stipend_long_term__c',
      dataValue('NumberVolunteers')
    ),
    field('X2018_Budget__c', dataValue('Budget2018')),
    field('X2019_Budget__c', dataValue('Budget2019')),
    field('X2020_Budget__c', dataValue('Budget2020')),
    field('Special_Sauce__c', dataValue('SpecialSauce')),
    field('Organizational_Needs__c', dataValue('OrgNeeds')),
    field('Capacity_Building_Priorities__c', dataValue('CapacityPriorities')),
    field('Other_Partnerships__c', dataValue('Networks')),
    field('Why_Apply__c', dataValue('WhyApply')),
    field('Expectations__c', dataValue('Expectations'))
  )
);
