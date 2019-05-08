package training

uses entity.*
uses gw.api.database.Query

class TrainingDataUtil {

  static function loadTrainingData() : void {
    print("loadTrainingData start!!!")
    var andyApplegate = Query.make(Credential).compare(Credential#UserName, Equals, "aapplegate").select().first()
    var student01 = Query.make(Credential).compare(Credential#UserName, Equals, "student01").select().first()

    if (andyApplegate == null ) {
      print("You must load the large sample data set before you can load the training data!!!")
    }
    else if (student01 != null) {
      print("The training data has already been loaded!!!")
    }
    else {
      // This version populates NO addresses -- as a workaround all address stuff is commented out!
      // get Acme primary address

        /*
        var queryObj1 = gw.api.database.Query.make(Address)

        queryObj1.compare ("PublicID", Equals, "cc:3")
        var primaryAddress = queryObj1.select().AtMostOneRow
          //added to deal with http://jira.guidewire.com/browse/CLM-26542
        var primaryAddress2 = queryObj1.select().AtMostOneRow
        var primaryAddress3 = queryObj1.select().AtMostOneRow
        var primaryAddress4 = queryObj1.select().AtMostOneRow
        var primaryAddress5 = queryObj1.select().AtMostOneRow

          //6 and higher may not be necessary...
        var primaryAddress6 = queryObj1.select().AtMostOneRow
        var primaryAddress7 = queryObj1.select().AtMostOneRow
        var primaryAddress8 = queryObj1.select().AtMostOneRow
        var primaryAddress9 = queryObj1.select().AtMostOneRow
        var primaryAddress10 = queryObj1.select().AtMostOneRow

          //end of addition to deal with JIRA
        */

      // get required roles
      var queryObj2 = gw.api.database.Query.make(Role)
      queryObj2.compare ("PublicID", Equals, "adjuster")
      var roleAdjuster = queryObj2.select().AtMostOneRow

      var queryObj3 = gw.api.database.Query.make(Role)
      queryObj3.compare ("PublicID", Equals, "sensitive_claims")
      var roleSensitive = queryObj3.select().AtMostOneRow

      var queryObj4 = gw.api.database.Query.make(Role)
      queryObj4.compare ("PublicID", Equals, "claims_supervisor")
      var roleSupervisor = queryObj4.select().AtMostOneRow

      var queryObj5 = gw.api.database.Query.make(Role)
      queryObj5.compare ("PublicID", Equals, "user_admin")
      var roleAdmin = queryObj5.select().AtMostOneRow

      var queryObj6 = gw.api.database.Query.make(Role)
      queryObj6.compare ("PublicID", Equals, "customer_service_rep")
      var roleCSR = queryObj6.select().AtMostOneRow

      // get required authority limit profiles
      var queryObj7 = gw.api.database.Query.make(AuthorityLimitProfile)
      queryObj7.compare ("Name", Equals, "Adjuster")
      var alpAdjuster = queryObj7.select().AtMostOneRow

      var queryObj8 = gw.api.database.Query.make(AuthorityLimitProfile)
      queryObj8.compare ("Name", Equals, "Claims Supervisor")
      var alpClaimsSupervisor = queryObj8.select().AtMostOneRow

      var queryObj9 = gw.api.database.Query.make(AuthorityLimitProfile)
      queryObj9.compare ("Name", Equals, "Regional Supervisor")
      var alpRegionalSupervisor = queryObj9.select().AtMostOneRow

      // create one-off users (useradmin, ibelt) and top-level group (Students)
      gw.transaction.Transaction.runWithNewBundle(\ newBundle -> {

        // user contacts....
        var useradminUserContact = new UserContact()
        useradminUserContact.FirstName = "Ursula"
        useradminUserContact.LastName = "Seradmin"
        useradminUserContact.EmailAddress1 = "useradmin@000guidewire.com"
        useradminUserContact.PrimaryPhone = TC_WORK
        useradminUserContact.WorkPhone = "555-555-1301"
        useradminUserContact.EmployeeNumber = "2000401"

        //for some reason, Ida Belt worked in the old code using primaryAddress
        var csrUserContact = new UserContact()
        csrUserContact.FirstName = "Ida"
        csrUserContact.LastName = "Belt"
        csrUserContact.EmailAddress1 = "ibelt@000guidewire.com"
        csrUserContact.PrimaryPhone = TC_WORK
        csrUserContact.WorkPhone = "555-555-1301"
        csrUserContact.EmployeeNumber = "2000402"

        // credentials....
        var useradminCredential = new Credential()
        useradminCredential.UserName = "useradmin"
        useradminCredential.Password = "PPNxQmp1UdWbZrn2G1Tj8+w01rI="

        var csrCredential = new Credential()
        csrCredential.UserName = "ibelt"
        csrCredential.Password = "PPNxQmp1UdWbZrn2G1Tj8+w01rI="

        // user settings...
        var useradminUserSettings = new UserSettings()
        useradminUserSettings.StartupPage = TC_DESKTOPACTIVITIES

        var csrUserSettings = new UserSettings()
        csrUserSettings.StartupPage = TC_CLAIMSEARCH

        // user roles...
        var useradminAdjusterUserRole = new UserRole()
        useradminAdjusterUserRole.Role = roleAdjuster

        var useradminSensitiveUserRole = new UserRole()
        useradminSensitiveUserRole.Role = roleSensitive

        var useradminSupervisorUserRole = new UserRole()
        useradminSupervisorUserRole.Role = roleSupervisor

        var useradminUserAdminUserRole = new UserRole()
        useradminUserAdminUserRole.Role = roleAdmin

        var csrCSRUserRole = new UserRole()
        csrCSRUserRole.Role = roleCSR

        // users...
        var useradminUser = new User()
        useradminUser.Contact = useradminUserContact
        useradminUser.Credential = useradminCredential
        useradminUser.ExternalUser = false
        useradminUser.AuthorityProfile = alpRegionalSupervisor
        useradminUser.UserSettings = useradminUserSettings
        useradminUser.Language = TC_EN_US
        useradminUser.addToRoles(useradminAdjusterUserRole)
        useradminUser.addToRoles(useradminSensitiveUserRole)
        useradminUser.addToRoles(useradminSupervisorUserRole)
        useradminUser.addToRoles(useradminUserAdminUserRole)

        var csrUser = new User()
        csrUser.Contact = csrUserContact
        csrUser.Credential = csrCredential
        csrUser.ExternalUser = false
        csrUser.UserSettings = csrUserSettings
        csrUser.Language = TC_EN_US
        csrUser.addToRoles(csrCSRUserRole)

        var csrGroupUser = new GroupUser()
        csrGroupUser.User = csrUser

        var queryObj10 = gw.api.database.Query.make(Group)
        queryObj10.compare ("Name", Equals, "Western Auto Group")
        var westernAutoGroup = queryObj10.select().AtMostOneRow

        var queryObj11 = gw.api.database.Query.make(SecurityZone)
        queryObj11.compare ("Name", Equals, "Auto and Property")
        var autoSecurityZone = queryObj11.select().AtMostOneRow

        var studentsGroup = new Group()
        studentsGroup.GroupType = TC_LOCAL
        studentsGroup.Name = "Students"
        studentsGroup.Parent = westernAutoGroup
        studentsGroup.SecurityZone = autoSecurityZone
        studentsGroup.WorldVisible = true
        studentsGroup.Supervisor = useradminUser
        studentsGroup.addToUsers(csrGroupUser)

        print("useradmin, ibelt, and Students group added")

      }, "su")

      var suffix : String

      var queryObj12 = gw.api.database.Query.make(Group)
      queryObj12.compare ("Name", Equals, "Students")
      var studentsGroup = queryObj12.select().AtMostOneRow

      var queryObj13 = gw.api.database.Query.make(SecurityZone)
      queryObj13.compare ("Name", Equals, "Auto and Property")
      var autoSecurityZone = queryObj13.select().AtMostOneRow

      // create one student user, coworker user, supervisor user, and group per enrolled student
      // (set 99 is for the instructor)
      gw.transaction.Transaction.runWithNewBundle(\newBundle -> {
        for (x in 1..21) {

          suffix = gw.api.util.StringUtil.formatNumber(x, "00")

          // The 21st account is for the instructor, and it should have the suffix "99"
          if (suffix == "21") {
            suffix = "99"
          }

          // user contacts....
          var studentUserContact = new UserContact()
          studentUserContact.FirstName = "Sam"
          studentUserContact.LastName = "Tudent" + suffix
          studentUserContact.EmailAddress1 = "student@000guidewire.com"
          studentUserContact.PrimaryPhone = TC_WORK
          studentUserContact.WorkPhone = "555-555-1301"
          studentUserContact.EmployeeNumber = "20001" + suffix

          var coworkerUserContact = new UserContact()
          coworkerUserContact.FirstName = "Cory"
          coworkerUserContact.LastName = "Worker" + suffix
          coworkerUserContact.EmailAddress1 = "coworker@000guidewire.com"
          coworkerUserContact.PrimaryPhone = TC_WORK
          coworkerUserContact.WorkPhone = "555-555-1301"
          coworkerUserContact.EmployeeNumber = "20002" + suffix

          var supervisorUserContact = new UserContact()
          supervisorUserContact.FirstName = "Shelley"
          supervisorUserContact.LastName = "Upervisor" + suffix
          supervisorUserContact.EmailAddress1 = "supervisor@000guidewire.com"
          supervisorUserContact.PrimaryPhone = TC_WORK
          supervisorUserContact.WorkPhone = "555-555-1301"
          supervisorUserContact.EmployeeNumber = "20003" + suffix

          // credentials....
          var studentCredential = new Credential()
          studentCredential.UserName = "student" + suffix
          studentCredential.Password = "PPNxQmp1UdWbZrn2G1Tj8+w01rI="

          var coworkerCredential = new Credential()
          coworkerCredential.UserName = "coworker" + suffix
          coworkerCredential.Password = "PPNxQmp1UdWbZrn2G1Tj8+w01rI="

          var supervisorCredential = new Credential()
          supervisorCredential.UserName = "supervisor" + suffix
          supervisorCredential.Password = "PPNxQmp1UdWbZrn2G1Tj8+w01rI="

          // user settings...
          var studentUserSettings = new UserSettings()
          studentUserSettings.StartupPage = TC_DESKTOPACTIVITIES

          var coworkerUserSettings = new UserSettings()
          coworkerUserSettings.StartupPage = TC_DESKTOPACTIVITIES

          var supervisorUserSettings = new UserSettings()
          supervisorUserSettings.StartupPage = TC_DESKTOPACTIVITIES

          // user roles...
          var studentAdjusterUserRole = new UserRole()
          studentAdjusterUserRole.Role = roleAdjuster

          var coworkerAdjusterUserRole = new UserRole()
          coworkerAdjusterUserRole.Role = roleAdjuster

          var coworkerSensitiveUserRole = new UserRole()
          coworkerSensitiveUserRole.Role = roleSensitive

          var supervisorAdjusterUserRole = new UserRole()
          supervisorAdjusterUserRole.Role = roleAdjuster

          var supervisorSensitiveUserRole = new UserRole()
          supervisorSensitiveUserRole.Role = roleSensitive

          var supervisorSupervisorUserRole = new UserRole()
          supervisorSupervisorUserRole.Role = roleSupervisor

          // users...
          var studentUser = new User()
          studentUser.Contact = studentUserContact
          studentUser.Credential = studentCredential
          studentUser.ExternalUser = false
          studentUser.AuthorityProfile = alpAdjuster
          studentUser.UserSettings = studentUserSettings
          studentUser.Language = TC_EN_US
          studentUser.addToRoles(studentAdjusterUserRole)

          var coworkerUser = new User()
          coworkerUser.Contact = coworkerUserContact
          coworkerUser.Credential = coworkerCredential
          coworkerUser.ExternalUser = false
          coworkerUser.AuthorityProfile = alpClaimsSupervisor
          coworkerUser.UserSettings = coworkerUserSettings
          coworkerUser.Language = TC_EN_US
          coworkerUser.addToRoles(coworkerAdjusterUserRole)
          coworkerUser.addToRoles(coworkerSensitiveUserRole)

          var supervisorUser = new User()
          supervisorUser.Contact = supervisorUserContact
          supervisorUser.Credential = supervisorCredential
          supervisorUser.ExternalUser = false
          supervisorUser.AuthorityProfile = alpRegionalSupervisor
          supervisorUser.UserSettings = supervisorUserSettings
          supervisorUser.Language = TC_EN_US
          supervisorUser.addToRoles(supervisorAdjusterUserRole)
          supervisorUser.addToRoles(supervisorSensitiveUserRole)
          supervisorUser.addToRoles(supervisorSupervisorUserRole)

          // group users...
          var studentGroupUser = new GroupUser()
          studentGroupUser.User = studentUser

          var coworkerGroupUser = new GroupUser()
          coworkerGroupUser.User = coworkerUser

          var supervisorGroupUser = new GroupUser()
          supervisorGroupUser.User = supervisorUser

          var aGroup = new Group()
          aGroup.GroupType = TC_AUTONORMAL
          aGroup.Name = "Training Group " + suffix
          aGroup.Parent = studentsGroup
          aGroup.SecurityZone = autoSecurityZone
          aGroup.WorldVisible = true
          aGroup.Supervisor = supervisorUser
          aGroup.addToUsers(studentGroupUser)
          aGroup.addToUsers(coworkerGroupUser)
          aGroup.addToUsers(supervisorGroupUser)

          var aQueue = new AssignableQueue()
          aQueue.Name = "Queue for Training Group " + suffix
          aQueue.Description = aQueue.Name
          aQueue.Group = aGroup
          aQueue.SubGroupVisible = true

          print("Added user accounts for group " + suffix)

        } // end 1..21 interval loop
      }, "su")
      print("The training data has been loaded!!!")
    }
  } // end loadDate() function
}
