package gw.solr.test1.weService

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.server.AvailabilityLevel
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiWebService

/**
 * Created by yasser.alnouri on 4/30/2019.
 */

@WsiWebService
@WsiPermissions({SystemPermissionType.TC_USERVIEW})
@WsiAvailability(AvailabilityLevel.MAINTENANCE)
class MyClaimAPI {
  function test(CNumber: String): String {
    return "test Done with input :   "+CNumber;
  }



  function getClaimDescription(CNumber: String): String {

    var queryobj = Query.make(Claim);
    queryobj.compare(Claim#ClaimNumber, Relop.Equals, CNumber);
    var result = queryobj.select().AtMostOneRow;
    if (result != null) {
      return result.Description;
    }
    return "No Claim found";
  }


  function getClaimSummary(CNumber: String): MyClaimSummary {
    var queryobj = Query.make(Claim)
    queryobj.compare(Claim#ClaimNumber, Relop.Equals, CNumber)
    var result = queryobj.select().AtMostOneRow;
    if (result != null) {
      var ob :MyClaimSummary = new MyClaimSummary(result.getClaimNumber(),result.getLOBCode().toString(),result.getLossCause().toString(),
          result.getLossLocation().toString(),result.getState().toString(),result.getInsured().toString())

      return  ob;
    }
    return null
  }
/*
  function addNote (CNumber : String , mynote : MyNoteSummary): boolean{
    var queryobj = Query.make(Claim)
    queryobj.compare(Claim#ClaimNumber, Relop.Equals, CNumber)
    var result = queryobj.select().AtMostOneRow;
    if (result != null) {
    Transaction.runWithNewBundle(\b ->{
      result = b.add(result)
      result.addNote(mynote.getBody())
    },"su")
      print("<<<<<<<<<< Done >>>>>>> ")
    }
    return true
  }
*/
}