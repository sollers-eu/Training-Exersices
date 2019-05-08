package gw.plugin.processes
uses gw.plugin.processing.IProcessesPlugin
uses gw.processes.BatchProcess
uses gw.solr.test1.batch.ExternalDbConnection
uses gw.solr.test1.batch.Flag_ClaimChanged
uses gw.util.ClaimHealthCalculatorBatch
uses gw.util.PurgeMessageHistory
uses gw.util.CatastropheClaimFinderBatch
uses gw.policy.RetiredPolicyGraphDisconnectorBatch
uses gw.processes.SolrDataImportBatchProcess
uses gw.api.financials.escalation.BulkInvoiceEscalationMonitor
uses gw.api.financials.escalation.FinancialsEscalationMonitor

@Export
class ProcessesPlugin implements IProcessesPlugin {

  construct() {
  }

  override function createBatchProcess(type : BatchProcessType, arguments : Object[]) : BatchProcess {
    switch(type) {
      case BatchProcessType.TC_BULKINVOICEESC:
          return new BulkInvoiceEscalationMonitor()
      case BatchProcessType.TC_CATASTROPHECLAIMFINDER:
          return new CatastropheClaimFinderBatch()
      case BatchProcessType.TC_CLAIMHEALTHCALC:
        return new ClaimHealthCalculatorBatch()
      case BatchProcessType.TC_FINANCIALSESC:
          return new FinancialsEscalationMonitor()
      case BatchProcessType.TC_PURGEMESSAGEHISTORY:
        return new PurgeMessageHistory(arguments)
      case BatchProcessType.TC_RETIREDPOLICYGRAPHDISCONNECTOR:
        return new RetiredPolicyGraphDisconnectorBatch()
      case BatchProcessType.TC_SOLRDATAIMPORT:
        return new SolrDataImportBatchProcess()
      case BatchProcessType.TC_CHANGEINCLAIMINFO:
        return new Flag_ClaimChanged()
      case BatchProcessType.TC_DBCONNECT:
        return  new ExternalDbConnection()
      default:
        return null
    }
  }

}
