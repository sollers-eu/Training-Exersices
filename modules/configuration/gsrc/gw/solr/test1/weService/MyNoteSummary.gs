package gw.solr.test1.weService

uses gw.xml.ws.annotation.WsiExportable

/**
 * Created by yasser.alnouri on 5/2/2019.
 */
class MyNoteSummary {
  var _subject : String
  var _body : String
  var _topic : String
  var _author : String

  function getSubject():String{return _subject}
  function  getBody():String{
    return _body
  }
  function getTopic():String{
    return _topic
  }
  function getAuthor():String{
    return _author
  }

}