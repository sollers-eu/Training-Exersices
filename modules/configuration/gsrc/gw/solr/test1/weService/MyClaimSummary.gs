package gw.solr.test1.weService

uses gw.xml.ws.annotation.WsiExportable
uses typekey.*
uses typekey.Address
uses typekey.Contact

/**
 * Created by yasser.alnouri on 5/2/2019.
 */
class MyClaimSummary {
  var _claimNumber : String
  var _lobCode : String
  var _lossCause : String
  var _lossLocation : String
  var _state : String
  var _insured : String



  construct(Number: String , lobCode : String , losscause: String , losslocation : String , state :String , insured :String){
  _claimNumber=Number
  _lobCode=lobCode
  _lossCause=losscause
  _lossLocation=losslocation
  _state=state
  _insured=insured
}
  construct(){

  }
}