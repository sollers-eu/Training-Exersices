package gw.solr.test1.batch

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.plugin.security.AuthenticationServicePlugin
uses gw.plugin.security.AuthenticationServicePluginCallbackHandler
uses gw.plugin.security.AuthenticationSource
uses gw.plugin.security.CredentialVerificationResult
uses gw.plugin.security.LockedCredentialException
uses gw.plugin.security.MustWaitToRetryException
uses gw.plugin.security.UserNamePasswordAuthenticationSource
uses gw.processes.BatchProcessBase

uses java.io.IOException
uses java.sql.*
uses java.util.logging.FileHandler
uses java.util.logging.Logger
uses java.util.logging.SimpleFormatter

uses com.guidewire.pl.system.security.impl.DefaultAuthenticationServicePlugin
uses com.guidewire.pl.web.*

uses javax.security.auth.login.FailedLoginException

/**
 * Created by yasser.alnouri on 5/5/2019.
 */
class ExternalDbConnection extends BatchProcessBase  implements AuthenticationServicePlugin {

  private static final var JDBC_DRIVER: String  = "org.h2.Driver";
  private static final var DB_URL: String  = "jdbc:h2:C:/Users/yasser.alnouri/Desktop/ext_db/db";
  private static final var USER: String  = "db_reader";
  private static final var PASS: String  = "gw";
  var  _handler:AuthenticationServicePluginCallbackHandler = null;
  var logger :Logger = Logger.getLogger("MyLog");
  var fh :FileHandler;

  construct(){
    super(BatchProcessType.TC_DBCONNECT);
  }
  protected override function doWork() {
    var conn : Connection = null;
    var stmt : Statement= null;
    prepareLogs()

    try {
      print("start");
      Class.forName(JDBC_DRIVER);
      print("Connecting to database...");
      conn = DriverManager.getConnection(DB_URL,USER,PASS);
      stmt = conn.createStatement();
      var sql:String  = "SELECT  * FROM INCOMINGUSERS ";
      var ExternalUsers :ResultSet = stmt.executeQuery(sql);
      CheckMissingUsers(ExternalUsers)

      ExternalUsers.close();
      stmt.close();
      conn.close();
    //  print(authenticate(new UserNamePasswordAuthenticationSource("su", "gw")))

    } catch(se : SQLException ) {
      se.printStackTrace();
    } catch(e:Exception ) {
      e.printStackTrace();
    }
    finally
    {
      try{
        if(stmt!=null) stmt.close();
      }
      catch(se2:SQLException) {
      }
      try {
        if(conn!=null) conn.close();
      }
      catch(se :SQLException ){
            se.printStackTrace();
      }
    }
  }

  private function CheckMissingUsers(externalUsers: ResultSet): void {
    var success_N : int = 0
    var faile_N : int =0
    var total : int = 0
    while(externalUsers.next()) {
      total++
      var queryobj = Query.make(Credential)
      if (externalUsers.getString("USERNAME") != null) {
        success_N++
        queryobj.compare(Credential#UserName, Relop.Equals, externalUsers.getString("USERNAME").toString())
        var target = queryobj.select().AtMostOneRow
        if (target == null) {
          print("missing User" + externalUsers.getString("USERNAME"))
        }
        else{
          faile_N++
          logger.info("UserName is missing for this record")
        }
    }
  }
    logger.info("total number of records imported" + total );
    logger.info("number of succesful imports" + success_N);
    logger.info("number of failure imports" + faile_N);
  }

  function prepareLogs(){


    try {

      // This block configure the logger with handler and formatter
      fh = new FileHandler("C:/ClaimCenter/logs/Database_Integration.log");
      logger.addHandler(fh);

     var formatter :SimpleFormatter = new SimpleFormatter();
      fh.setFormatter(formatter);

      // the following statement is used to log any messages
    } catch (e : SecurityException) {
      e.printStackTrace();
    } catch (e :IOException ) {
      e.printStackTrace();
    }


    }



  override function authenticate(source: AuthenticationSource): String {
    if(!(source typeis UserNamePasswordAuthenticationSource)) {
      throw new IllegalArgumentException("Authentication source type " + source.getClass().getName() + " is not known to this plugin");
    } else if(this._handler == null) {
      throw new IllegalArgumentException("Callback handler not set");
    } else {
      var uNameSource:UserNamePasswordAuthenticationSource = (source as UserNamePasswordAuthenticationSource);
       var username:String = uNameSource.getUsername();
      var userPublicId : String = this._handler.findUser(username);
      if(userPublicId == null) {
        throw new FailedLoginException("Bad user name " + username);
      } else {

        var returnCode : CredentialVerificationResult= this._handler.verifyInternalCredential(userPublicId, uNameSource.getPassword());
        if(returnCode == CredentialVerificationResult.BAD_USER_ID) {
          throw new FailedLoginException("Bad user name " + username);
        } else if(returnCode == CredentialVerificationResult.WAIT_TO_RETRY) {
          throw new MustWaitToRetryException("Still within the login retry delay period");
        } else if(returnCode == CredentialVerificationResult.CREDENTIAL_LOCKED) {
          throw new LockedCredentialException("The specified account has been locked");
        } else if(returnCode == CredentialVerificationResult.PASSWORD_MISMATCH) {
          throw new FailedLoginException("Bad password for user " + username);
        } else {
          return userPublicId;
        }
      }
    }
  }

  override function setCallback(authenticationServicePluginCallbackHandler: AuthenticationServicePluginCallbackHandler) {

    this._handler=authenticationServicePluginCallbackHandler
  }
}
