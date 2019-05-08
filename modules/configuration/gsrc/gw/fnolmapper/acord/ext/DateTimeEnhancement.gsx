package gw.fnolmapper.acord.ext

uses gw.xml.xsd.types.XSDDateTime
uses java.util.TimeZone
uses gw.xml.xsd.types.AbstractXSDDateType
uses gw.fnolmapper.DatePatterns
uses gw.xml.xsd.types.XSDDate

@Export
enhancement DateTimeEnhancement : xsd.acord.types.complex.DateTime {
  //Converts the DateTime element into a Java Date
  function toDate() : java.util.Date {
    var d:AbstractXSDDateType
    //allow for xs:Date
    if(this.Value.matches(DatePatterns.XSD_DATE))
      d = new XSDDate(this.Value)
    else
      d = new XSDDateTime(this.Value)
    if(d.TimeZone==null)
      d.TimeZone = TimeZone.getDefault()
    return d.toCalendar().Time
  }
}
