package gw.solr.test1.batch

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.processes.BatchProcessBase
uses gw.xml.XmlElement
uses typekey.*

uses javax.xml.namespace.QName
uses java.io.BufferedWriter
uses java.io.File
uses java.io.FileWriter

/**
 * Created by yasser.alnouri on 5/2/2019.
 */
class Flag_ClaimChanged extends BatchProcessBase {

  construct() {
    super(BatchProcessType.TC_CHANGEINCLAIMINFO);
  }


  protected override function doWork() {
    print("just Started Bath process")
    var queryObj = Query.make(Claim)
    queryObj.compare(Claim#isChanged,Relop.Equals,true)
    var claims = queryObj.select()

    for(claim in claims){
      writeXmlFile(claim)
    }




  }

  private function writeXmlFile(aclaim: Claim): void {
    var newbundle = gw.transaction.Transaction.newBundle()
    aclaim=newbundle.add(aclaim)
    var xmlobj = new XmlElement(new QName("http://guidewire.com/config","Claim"))
    xmlobj.setAttributeValue("ClaimNumber", aclaim.ClaimNumber)
    xmlobj.setAttributeValue("lossType",aclaim.LossType.toString())
    xmlobj.setAttributeValue("state",aclaim.State.toString())
    xmlobj.setAttributeValue("publicIp",aclaim.PublicID)
    var exposures = aclaim.Exposures
    for(exposure in exposures){
      if(exposure.isChanged){
        exposure.isChanged=false
        var chilXml = new XmlElement(new QName("http://guidewire.com/config","exposure"))
        chilXml.setAttributeValue("exposure.Vocerage.Type",exposure.Coverage.Type.toString())
        chilXml.setAttributeValue("exposure.coverage.subtype",exposure.Coverage.Subtype.toString())
        chilXml.setAttributeValue("exposure.publicId",exposure.PublicID)
        chilXml.setAttributeValue("exposure.exposureType",exposure.ExposureType.toString())
        xmlobj.addChild(chilXml)
      }
    }

    var filepath = "C_"+aclaim.DisplayName+"_"+System.currentTimeMillis()+".xml"
    var exportObj=new BufferedWriter(new FileWriter(new File(filepath)))
    exportObj.write(xmlobj.asUTFString())
    exportObj.close()
    aclaim.isChanged=false
    newbundle.commit()

  }


}